import logging
from dotenv import load_dotenv
from packages.ingest.shopify import shopify
import os
from dbt.cli.main import dbtRunner, dbtRunnerResult
import psycopg2

logging.basicConfig(level=logging.INFO)

load_dotenv("../../.env")

CONFIG = {
    "db_name": os.getenv("DB_NAME"),
    "dbt_user": os.getenv("DBT_USER"),
    "dbt_password": os.getenv("DBT_PASSWORD"),
    "db_host": os.getenv("DB_HOST"),
    "db_port": os.getenv("DB_PORT"),
}

def main() -> None:
    logging.info("Starting process...")
    conn = psycopg2.connect(dbname=CONFIG["db_name"], user=CONFIG["dbt_user"], password=CONFIG["dbt_password"],
                            host=CONFIG["db_host"], port=CONFIG["db_port"])
    
    cursor = conn.cursor()
    cursor.execute("SELECT id, \"shopifyShopPrefix\", \"shopifyAdminApiAccessToken\" FROM public.\"Organization\"")
    organizations = cursor.fetchall()
    conn.close()

    logging.info(f"Found {len(organizations)} organizations to process.")

    for org_id, shopify_prefix, shopify_admin_api_access_token in organizations:
        if not shopify_prefix or not shopify_admin_api_access_token:
            logging.warning(f"Skipping organization {org_id} due to missing shopify prefix or admin API access token.")
            continue

        logging.info(f"Processing organization {org_id}...")
        shopify.sync_shopfy(shopify_prefix, org_id, shopify_admin_api_access_token, CONFIG["db_name"], CONFIG["dbt_user"], CONFIG["dbt_password"], CONFIG["db_host"], CONFIG["db_port"])

    dbt = dbtRunner()
    logging.info("Running dbtRunner...")

    vars_yaml = """
    DB_NAME: "{db_name}"
    DBT_USER: "{dbt_user}"
    DBT_PASSWORD: "{dbt_password}"
    DB_HOST: "{db_host}"
    DB_PORT: {db_port}
    """.format(
        db_name=CONFIG["db_name"],
        dbt_user=CONFIG["dbt_user"],
        dbt_password=CONFIG["dbt_password"],
        db_host=CONFIG["db_host"],
        db_port=CONFIG["db_port"],
    )

    cli_args = ["run", "--vars", vars_yaml]
    res: dbtRunnerResult = dbt.invoke(cli_args)
    logging.info(res)
    for r in res.result:
        logging.info(f"{r.node.name}: {r.status}")

    logging.info("Process completed successfully.")

if __name__ == "__main__":
    main()
