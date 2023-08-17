{{ config(schema='ods') }}

WITH latest_images AS (
    SELECT 
        id,
        ds_shopify_prefix,
        ds_clerk_org_id,
        ds_row_date,
        shopify_data->>'id' AS shopify_id,
        shopify_data->>'id' AS shopify_product_id,
        jsonb_array_elements(shopify_data->'images') ->> 'id' AS image_id,
        jsonb_array_elements(shopify_data->'images') ->> 'alt' AS alt,
        jsonb_array_elements(shopify_data->'images') ->> 'src' AS src,
        jsonb_array_elements(shopify_data->'images') ->> 'width' AS width,
        jsonb_array_elements(shopify_data->'images') ->> 'height' AS height,
        jsonb_array_elements(shopify_data->'images') ->> 'position' AS position,
        jsonb_array_elements(shopify_data->'images') ->> 'created_at' AS created_at,
        jsonb_array_elements(shopify_data->'images') ->> 'updated_at' AS updated_at,
        jsonb_array_elements(shopify_data->'images') ->> 'product_id' AS product_id,
        ROW_NUMBER() OVER (PARTITION BY shopify_data->>'id' ORDER BY ds_row_date DESC) AS rn
    FROM landing.shopify
    WHERE shopify_resource = 'products'
)

SELECT *
FROM latest_images
WHERE rn = 1