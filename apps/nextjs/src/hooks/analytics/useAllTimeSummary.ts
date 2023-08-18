import { useEffect, useState } from "react";

import { api } from "../../utils/api";
import { industryAverageNewCustomerRevenuePct } from "../../utils/constants";

interface AllTimeSummary {
  "Total Orders": number;
  "Total Revenue": number;
  "Total New Customer Orders": number;
  "Total New Customer Revenue": number;
  "Industry Average NCR %": number;
  "New Customer Revenue %": number;
}

export const useAllTimeSummary = ({ storePrefix }: { storePrefix: string }) => {
  const [allTimeSummary, setAllTimeSummary] = useState<AllTimeSummary>({
    "Total Orders": 0,
    "Total Revenue": 0,
    "Total New Customer Orders": 0,
    "Total New Customer Revenue": 0,
    "Industry Average NCR %": 0,
    "New Customer Revenue %": 0,
  });
  const [isLoadingAllTimeSummary, setIsLoadingAllTimeSummary] = useState(true);
  const [errorAllTimeSummary, setErrorAllTimeSummary] = useState<string | null>(
    null,
  );

  const allTimeSummaryQuery = api.analyticsGeneral.allTimeSummary.useQuery(
    {
      storePrefix,
    },
    {
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (allTimeSummaryQuery.data) {
      const data = allTimeSummaryQuery.data.map((d) => ({
        "Total Orders": d.shopify_total_orders,
        "Total Revenue": d.shopify_total_order_value,
        "Total New Customer Orders": d.shopify_total_first_orders,
        "Total New Customer Revenue": d.shopify_total_first_order_value,
        "Industry Average NCR %": industryAverageNewCustomerRevenuePct,
        "New Customer Revenue %":
          d.shopify_total_first_order_value / d.shopify_total_order_value,
      }));

      if (!data[0]) {
        setErrorAllTimeSummary("No data found for the provided store prefix.");
        return;
      }

      setAllTimeSummary(data[0]);
      setIsLoadingAllTimeSummary(false);
    }
  }, [allTimeSummaryQuery.data]);

  return {
    allTimeSummary,
    isLoadingAllTimeSummary,
    errorAllTimeSummary,
    refetchAllTimeSummary: allTimeSummaryQuery.refetch,
  };
};
