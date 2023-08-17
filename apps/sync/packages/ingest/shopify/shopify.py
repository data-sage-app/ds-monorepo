# TO DO:
# [ ] - Add logging
# [ ] - Add error handling
# [ ] - Add tests
# [ ] - Some resources have pagination, need to handle that
# [ ] - Some resources don't have updated_at populated, need to handle that with change detection

import psycopg2
import requests
import json
import logging

api_version = "2023-07"

QUERIES = [
    {
        "name": "products",
        "query": "products.json?limit=250"
    },
    {
        "name": "orders",
        "query": "orders.json?status=any&limit=250"
    },
    {
        "name": "customers",
        "query": "customers.json?limit=250"
    },
    {
        "name": "checkouts",
        "query": "checkouts.json?limit=250"
    }
]

logging.basicConfig(level=logging.INFO)

def sync_shopify_resources_to_tbl(shopify_prefix, clerk_org_id, shopify_admin_api_access_token, conn: psycopg2.connect):
    with conn.cursor() as cur:
        for query in QUERIES:

            logging.info(f"Syncing {query['name']} for {shopify_prefix}")

            cur.execute(
                f"SELECT MAX(shopify_updated_at) FROM landing.shopify WHERE ds_shopify_prefix = '{shopify_prefix}' AND shopify_resource = '{query['name']}';"
            )
            max_updated_at = cur.fetchone()[0]

            headers = {
                "X-Shopify-Access-Token": shopify_admin_api_access_token,
                "Content-Type": "application/json",
            }

            url = f"https://{shopify_prefix}.myshopify.com/admin/api/{api_version}/{query['query']}"
            if max_updated_at:
                url += f"&updated_at_min={max_updated_at.isoformat()}"

            while url:
                logging.info(f"Requesting {url} with updated_at_min={max_updated_at}")

                request = requests.get(url, headers=headers)
                try:
                    data = json.loads(request.text)[query['name']]
                except json.JSONDecodeError:
                    print(request.text)
                    logging.error("JSON decoding failed for URL: " + url)
                    continue

                logging.info(f"Found {len(data)} {query['name']} for {shopify_prefix}")

                for item in data:
                    cur.execute(
                        """
                        INSERT INTO landing.shopify (ds_shopify_prefix, ds_clerk_org_id, ds_row_date, shopify_resource, shopify_id, shopify_updated_at, shopify_data)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                        (
                            shopify_prefix,
                            clerk_org_id,
                            item.get("updated_at", "NOW()"),
                            query['name'],
                            item["id"],
                            item.get("updated_at", None),
                            json.dumps(item),
                        ),
                    )

                # Pagination handling
                next_page_link = request.links.get('next', {}).get('url')
                if next_page_link:
                    url = next_page_link
                else:
                    url = None

        conn.commit()



def sync_shopfy(shopify_prefix, clerk_org_id, shopify_admin_api_access_token, db_name, dbt_user, dbt_password, db_host, db_port):
    logging.info(f"Starting synchronization for {shopify_prefix}")
    conn = psycopg2.connect(dbname=db_name, user=dbt_user, password=dbt_password, host=db_host, port=db_port)
    sync_shopify_resources_to_tbl(shopify_prefix, clerk_org_id, shopify_admin_api_access_token, conn)
    conn.close()
    logging.info(f"Finished synchronization for {shopify_prefix}")

