import { useEffect, useState } from "react";

import { api } from "../../utils/api";
import { industryAverageNewCustomerRevenuePct } from "../../utils/constants";

interface DailySummary {
  date: Date;
  "Total Orders": number;
  "Total Revenue": number;
  "Total New Customer Orders": number;
  "Total New Customer Revenue": number;
  "Industry Average NCR %": number;
  "New Customer Revenue %": number;
}

export const useDailySummary = ({
  storePrefix,
  fromDate,
  toDate,
}: {
  storePrefix: string;
  fromDate?: Date;
  toDate?: Date;
}) => {
  const [dailySummary, setDailySummary] = useState<DailySummary[]>([]);
  const [isLoadingDailySummary, setIsLoadingDailySummary] = useState(true);
  const [errorDailySummary, setErrorDailySummary] = useState<string | null>(
    null,
  );
  const [twelveMonthsAgo, setTwelveMonthsAgo] = useState<Date>();

  useEffect(() => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    setTwelveMonthsAgo(twelveMonthsAgo);
  }, []);

  const dailySummaryQuery = api.analyticsGeneral.dailySummary.useQuery(
    {
      storePrefix,
      fromDate,
      toDate,
    },
    {
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (dailySummaryQuery.data) {
      const data = dailySummaryQuery.data.map((d) => ({
        date: d.date,
        "Total Orders": d.shopify_total_orders,
        "Total Revenue": d.shopify_total_order_value,
        "Total New Customer Orders": d.shopify_total_first_orders,
        "Total New Customer Revenue": d.shopify_total_first_order_value,
        "Industry Average NCR %": industryAverageNewCustomerRevenuePct,
        "New Customer Revenue %":
          d.shopify_total_first_order_value / d.shopify_total_order_value,
      }));

      if (!data[0]) {
        setErrorDailySummary(
          "No data found for the provided store prefix and date range.",
        );
        return;
      }

      setDailySummary(data);
      setIsLoadingDailySummary(false);
    }
  }, [dailySummaryQuery.data]);

  return {
    dailySummary,
    isLoadingDailySummary,
    errorDailySummary,
    refetchDailySummary: dailySummaryQuery.refetch,
  };
};
