{{ config(schema='ods') }}

WITH latest_products AS (
  select  id,
          ds_shopify_prefix,
          ds_clerk_org_id,
          ds_row_date,
          shopify_id,
          shopify_data->>'status' as status,
          shopify_data->>'vendor' as vendor,
          shopify_data->'image'->>'id' as image_id,
          shopify_data->'image'->>'alt' as image_alt,
          shopify_data->'image'->>'src' as image_src,
          shopify_data->'image'->>'width' as image_width,
          shopify_data->'image'->>'height' as image_height,
          shopify_data->'image'->>'position' as image_position,
          shopify_data->'image'->>'created_at' as image_created_at,
          shopify_data->'image'->>'updated_at' as image_updated_at,
          shopify_data->'image'->>'product_id' as image_product_id,
          shopify_data->'image'->>'admin_graphql_api_id' as image_admin_graphql_api_id,
          shopify_data->>'title' as title,
          shopify_data->>'handle' as handle,
          shopify_data->>'body_html' as body_html,
          shopify_data->>'created_at' as created_at,
          shopify_data->>'updated_at' as updated_at,
          shopify_data->>'product_type' as product_type,
          shopify_data->>'published_at' as published_at,
          shopify_data->>'published_scope' as published_scope,
          shopify_data->>'template_suffix' as template_suffix,
          shopify_data->>'admin_graphql_api_id' as admin_graphql_api_id,
          shopify_data->'options'->0->'values' as options_values,
          ROW_NUMBER() OVER (PARTITION BY shopify_data->>'id' ORDER BY ds_row_date DESC) AS rn
  from landing.shopify
  where shopify_resource = 'products'
)

SELECT *
FROM latest_products
WHERE rn = 1