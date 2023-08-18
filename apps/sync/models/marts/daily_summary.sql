{{ config(schema='marts') }}

WITH 
Stores AS (
	SELECT ds_shopify_prefix, ds_clerk_org_id, MIN(created_at::DATE) AS start_date, MAX(created_at::DATE) AS end_date
	FROM dbt_ods.shopify_orders
	GROUP BY ds_shopify_prefix, ds_clerk_org_id
),
Date_Dimension AS (
  SELECT
	ds_shopify_prefix,
	ds_clerk_org_id,
    start_date + INTERVAL '1 day' * generate_series(0, end_date - start_date) AS date
  FROM Stores
),
Orders_That_Are_First_Order AS (
  SELECT
    created_at::DATE AS order_date,
	  ds_shopify_prefix,
	  ds_clerk_org_id,
    total_price
  FROM (
    SELECT
      o.*,
      MIN(o.order_number) OVER (PARTITION BY o.shopify_customer_id) AS FIRST_ORDER_NUMBER,
      order_number = MIN(o.order_number) OVER (PARTITION BY o.shopify_customer_id) AS FIRST_ORDER_FLAG
    FROM dbt_ods.shopify_orders AS o
  ) AS o_with_first_order
  WHERE o_with_first_order.FIRST_ORDER_FLAG = TRUE
),
Total_Orders AS (
  SELECT
    created_at::DATE AS order_date,
	  ds_shopify_prefix,
	  ds_clerk_org_id,
    COUNT(*) AS total_orders,
    SUM(total_price) AS total_order_value
  FROM dbt_ods.shopify_orders
  GROUP BY created_at::DATE, ds_shopify_prefix, ds_clerk_org_id
)
SELECT
  dd.ds_shopify_prefix,
  dd.ds_clerk_org_id,
  dd.date,
  COALESCE(t_orders.total_orders, 0) AS shopify_total_orders,
  COALESCE(t_orders.total_order_value, 0) AS shopify_total_order_value,
  COUNT(o.order_date) AS shopify_total_first_orders,
  COALESCE(SUM(o.total_price), 0) AS shopify_total_first_order_value
FROM Date_Dimension AS dd
LEFT JOIN Total_Orders AS t_orders
ON dd.date = t_orders.order_date AND dd.ds_clerk_org_id = t_orders.ds_clerk_org_id and dd.ds_shopify_prefix = t_orders.ds_shopify_prefix
LEFT JOIN Orders_That_Are_First_Order AS o
ON dd.date = o.order_date and t_orders.ds_shopify_prefix = o.ds_shopify_prefix and t_orders.ds_clerk_org_id = o.ds_clerk_org_id
GROUP BY
  dd.date,
  t_orders.total_orders,
  t_orders.total_order_value,
  dd.ds_shopify_prefix,
  dd.ds_clerk_org_id
ORDER BY dd.date