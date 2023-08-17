{{ config(schema='ods') }}

WITH latest_variants AS (
    SELECT 
        id,
        ds_shopify_prefix,
        ds_clerk_org_id,
        ds_row_date,
        shopify_data->>'id' AS shopify_id,
        shopify_data->>'id' AS shopify_product_id,
        jsonb_array_elements(shopify_data->'variants') ->> 'id' AS variant_id,
        jsonb_array_elements(shopify_data->'variants') ->> 'sku' AS sku,
        CAST(jsonb_array_elements(shopify_data->'variants') ->> 'grams' AS INTEGER) AS grams,
        CAST(jsonb_array_elements(shopify_data->'variants') ->> 'price' AS DECIMAL) AS price,
        jsonb_array_elements(shopify_data->'variants') ->> 'title' AS title,
        CAST(jsonb_array_elements(shopify_data->'variants') ->> 'weight' AS DECIMAL) AS weight,
        jsonb_array_elements(shopify_data->'variants') ->> 'weight_unit' AS weight_unit,
        jsonb_array_elements(shopify_data->'variants') ->> 'inventory_policy' AS inventory_policy,
        jsonb_array_elements(shopify_data->'variants') ->> 'inventory_management' AS inventory_management,
        ROW_NUMBER() OVER (PARTITION BY shopify_data->>'id' ORDER BY ds_row_date DESC) AS rn
    FROM landing.shopify
    WHERE shopify_resource = 'products'
)

SELECT *
FROM latest_variants
WHERE rn = 1

