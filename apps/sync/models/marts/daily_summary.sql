{{ config(schema='marts') }}

WITH Date_Range AS (
  SELECT MIN(created_at::DATE) AS start_date, MAX(created_at::DATE) AS end_date
  FROM dbt_ods.shopify_orders
),
Date_Dimension AS (
  SELECT
    start_date + INTERVAL '1 day' * generate_series(0, end_date - start_date) AS date,
    EXTRACT(YEAR FROM start_date + INTERVAL '1 day' * generate_series(0, end_date - start_date)) AS year,
    EXTRACT(MONTH FROM start_date + INTERVAL '1 day' * generate_series(0, end_date - start_date)) AS month,
    EXTRACT(DAY FROM start_date + INTERVAL '1 day' * generate_series(0, end_date - start_date)) AS day,
    EXTRACT(DOW FROM start_date + INTERVAL '1 day' * generate_series(0, end_date - start_date)) AS day_of_week,
    EXTRACT(WEEK FROM start_date + INTERVAL '1 day' * generate_series(0, end_date - start_date)) AS week
  FROM Date_Range
),
Orders_That_Are_First_Order AS (
  SELECT
    created_at::DATE AS order_date,
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
    COUNT(*) AS total_orders,
    SUM(total_price) AS total_order_value,
    MAX(ds_shopify_prefix) AS ds_shopify_prefix,
    MAX(ds_clerk_org_id) AS ds_clerk_org_id
  FROM dbt_ods.shopify_orders
  GROUP BY created_at::DATE
)
SELECT
  dd.date,
  dd.year,
  dd.month,
  dd.day,
  dd.day_of_week,
  dd.week,
  COALESCE(t_orders.total_orders, 0) AS total_orders,
  COALESCE(t_orders.total_order_value, 0) AS total_order_value,
  COUNT(o.order_date) AS total_first_orders,
  COALESCE(SUM(o.total_price), 0) AS total_first_order_value,
  t_orders.ds_shopify_prefix,
  t_orders.ds_clerk_org_id
FROM Date_Dimension AS dd
LEFT JOIN Total_Orders AS t_orders
ON dd.date = t_orders.order_date
LEFT JOIN Orders_That_Are_First_Order AS o
ON dd.date = o.order_date
GROUP BY
  dd.date,
  dd.year,
  dd.month,
  dd.day,
  dd.day_of_week,
  dd.week,
  t_orders.total_orders,
  t_orders.total_order_value,
  t_orders.ds_shopify_prefix,
  t_orders.ds_clerk_org_id
ORDER BY dd.date