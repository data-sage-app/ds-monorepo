{{ config(schema='marts') }}

select  ds_shopify_prefix,
        ds_clerk_org_id,
        sum(shopify_total_orders) as shopify_total_orders,
        sum(shopify_total_order_value) as shopify_total_order_value,
        sum(shopify_total_first_orders) as shopify_total_first_orders,
        sum(shopify_total_first_order_value) as shopify_total_first_order_value
from {{ref('monthly_summary')}}
group by  ds_shopify_prefix,
          ds_clerk_org_id