{{ config(schema='ods') }}

WITH line_items AS (
    SELECT 
        id,
        ds_shopify_prefix,
        ds_clerk_org_id,
        ds_row_date,
        line_item->>'id' AS shopify_id,
        shopify_data->>'id' AS shopify_order_id,
        line_item->>'product_id' AS shopify_product_id,
        line_item->>'variant_id' AS shopify_product_variant_id,
        line_item->>'admin_graphql_api_id' AS admin_graphql_api_id,
        CAST(line_item->>'fulfillable_quantity' AS INTEGER) AS fulfillable_quantity,
        line_item->>'fulfillment_service' AS fulfillment_service,
        line_item->>'fulfillment_status' AS fulfillment_status,
        line_item->>'gift_card' AS gift_card,
        CAST(line_item->>'grams' AS INTEGER) AS grams,
        line_item->>'name' AS name,
        CAST(line_item->>'price' AS DECIMAL) AS price,
        CAST(line_item->'price_set'->'shop_money'->>'amount' AS DECIMAL) AS shop_money_amount,
        line_item->'price_set'->'shop_money'->>'currency_code' AS shop_money_currency_code,
        CAST(line_item->'price_set'->'presentment_money'->>'amount' AS DECIMAL) AS presentment_money_amount,
        line_item->'price_set'->'presentment_money'->>'currency_code' AS presentment_money_currency_code,
        line_item->>'product_exists' AS product_exists,
        CAST(line_item->>'quantity' AS INTEGER) AS quantity,
        line_item->>'requires_shipping' AS requires_shipping,
        line_item->>'sku' AS sku,
        line_item->>'taxable' AS taxable,
        line_item->>'title' AS title,
        CAST(line_item->>'total_discount' AS DECIMAL) AS total_discount,
        CAST(line_item->'total_discount_set'->'shop_money'->>'amount' AS DECIMAL) AS shop_money_total_discount_amount,
        line_item->'total_discount_set'->'shop_money'->>'currency_code' AS shop_money_total_discount_currency_code,
        CAST(line_item->'total_discount_set'->'presentment_money'->>'amount' AS DECIMAL) AS presentment_money_total_discount_amount,
        line_item->'total_discount_set'->'presentment_money'->>'currency_code' AS presentment_money_total_discount_currency_code,
        line_item->>'variant_inventory_management' AS variant_inventory_management,
        line_item->>'variant_title' AS variant_title,
        line_item->>'vendor' AS vendor,
        ROW_NUMBER() OVER (PARTITION BY shopify_data->>'id' ORDER BY ds_row_date DESC) AS rn
    FROM landing.shopify,
         jsonb_array_elements(shopify_data->'line_items') AS line_item
    WHERE shopify_resource = 'orders'
)
SELECT * FROM line_items