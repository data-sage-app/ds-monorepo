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
RESOURCES = ["products", "orders", "customers", "checkouts"]

logging.basicConfig(level=logging.INFO)

def sync_shopify_resources_to_tbl(shopify_prefix, clerk_org_id, shopify_admin_api_access_token, conn: psycopg2.connect):
    with conn.cursor() as cur:
        for resource in RESOURCES:
            logging.info(f"Syncing {resource} for {shopify_prefix}")

            cur.execute(
                f"SELECT MAX(shopify_updated_at) FROM landing.shopify WHERE ds_shopify_prefix = '{shopify_prefix}' AND shopify_resource = '{resource}';"
            )
            max_updated_at = cur.fetchone()[0]

            headers = {
                "X-Shopify-Access-Token": shopify_admin_api_access_token,
                "Content-Type": "application/json",
            }

            url = f"https://{shopify_prefix}.myshopify.com/admin/api/{api_version}/{resource}.json"
            if max_updated_at:
                url += f"?updated_at_min={max_updated_at.isoformat()}"

            request = requests.get(url, headers=headers)
            data = json.loads(request.text)[resource]

            logging.info(f"Found {len(data)} {resource} for {shopify_prefix}")

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
                        resource,
                        item["id"],
                        item.get("updated_at", None),
                        json.dumps(item),
                    ),
                )

        conn.commit()


def sync_shopfy(shopify_prefix, clerk_org_id, shopify_admin_api_access_token, db_name, dbt_user, dbt_password, db_host, db_port):
    logging.info(f"Starting synchronization for {shopify_prefix}")
    conn = psycopg2.connect(dbname=db_name, user=dbt_user, password=dbt_password, host=db_host, port=db_port)
    sync_shopify_resources_to_tbl(shopify_prefix, clerk_org_id, shopify_admin_api_access_token, conn)
    conn.close()
    logging.info(f"Finished synchronization for {shopify_prefix}")

