{{ config(schema='ods') }}

WITH customers AS (
  SELECT 
      id,
      ds_shopify_prefix,
      ds_clerk_org_id,
      ds_row_date,
      shopify_data->>'id' AS shopify_id,
      shopify_data->>'note' AS note,
      shopify_data->>'tags' AS tags,
      shopify_data->>'email' AS email,
      shopify_data->>'phone' AS phone,
      shopify_data->>'state' AS state,
      shopify_data->>'currency' AS currency,
      shopify_data->>'last_name' AS last_name,
      shopify_data->>'created_at' AS created_at,
      shopify_data->>'first_name' AS first_name,
      shopify_data->>'tax_exempt' AS tax_exempt,
      shopify_data->>'updated_at' AS updated_at,
      shopify_data->>'total_spent' AS total_spent,
      shopify_data->>'orders_count' AS orders_count,
      shopify_data->>'last_order_id' AS last_order_id,
      shopify_data->>'verified_email' AS verified_email,
      shopify_data->>'last_order_name' AS last_order_name,
      shopify_data->>'accepts_marketing' AS accepts_marketing,
      shopify_data->>'admin_graphql_api_id' AS admin_graphql_api_id,
      shopify_data->'sms_marketing_consent'->>'state' AS sms_marketing_state,
      shopify_data->'sms_marketing_consent'->>'opt_in_level' AS sms_marketing_opt_in_level,
      shopify_data->'sms_marketing_consent'->>'consent_updated_at' AS sms_marketing_consent_updated_at,
      shopify_data->'sms_marketing_consent'->>'consent_collected_from' AS sms_marketing_consent_collected_from,
      shopify_data->>'marketing_opt_in_level' AS marketing_opt_in_level,
      shopify_data->'email_marketing_consent'->>'state' AS email_marketing_state,
      shopify_data->'email_marketing_consent'->>'opt_in_level' AS email_marketing_opt_in_level,
      shopify_data->'email_marketing_consent'->>'consent_updated_at' AS email_marketing_consent_updated_at,
      shopify_data->>'accepts_marketing_updated_at' AS accepts_marketing_updated_at,
      ROW_NUMBER() OVER (PARTITION BY shopify_data->>'id' ORDER BY ds_row_date DESC) AS rn
  FROM landing.shopify
    WHERE shopify_resource = 'customers'
)

SELECT *
FROM customers
WHERE rn = 1
