CREATE SCHEMA IF NOT EXISTS landing;

CREATE TABLE IF NOT EXISTS landing.shopify (
    id SERIAL PRIMARY KEY,
    ds_shopify_prefix varchar(100),
    ds_clerk_org_id varchar(100),
    ds_row_date TIMESTAMPTZ,
    shopify_resource varchar(100),
    shopify_id BIGINT NOT NULL,
    shopify_updated_at TIMESTAMPTZ,
    shopify_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_ds_shopify_prefix ON landing.shopify (ds_shopify_prefix);
CREATE INDEX IF NOT EXISTS idx_ds_clerk_org_id ON landing.shopify (ds_clerk_org_id);
CREATE INDEX IF NOT EXISTS idx_shopify_resource ON landing.shopify (shopify_resource);
CREATE INDEX IF NOT EXISTS idx_shopify_id ON landing.shopify (shopify_id);

GRANT ALL PRIVILEGES ON SCHEMA landing TO "onu-dev";
GRANT ALL PRIVILEGES ON TABLE landing.shopify TO "onu-dev";
GRANT USAGE, SELECT ON SEQUENCE landing.shopify_id_seq TO "onu-dev";