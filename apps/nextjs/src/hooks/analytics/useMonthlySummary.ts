import { useEffect, useState } from "react";
import { mutate, tidy } from "@tidyjs/tidy";

import { api } from "../../utils/api";
import { industryAverageNewCustomerRevenuePct } from "../../utils/constants";

interface MonthlySummary {
  monthStartDate: Date;
  "Month Name": string;
  "Total Orders": number;
  "Total Revenue": number;
  "Total New Customer Orders": number;
  "Total New Customer Revenue": number;
  "Industry Average NCR %": number;
  "New Customer Revenue %": number;
}

export const useMonthlySummary = ({
  storePrefix,
  fromDate,
  toDate,
}: {
  storePrefix: string;
  fromDate?: Date;
  toDate?: Date;
}) => {
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [isLoadingMonthlySummary, setIsLoadingMonthlySummary] = useState(true);
  const [errorMonthlySummary, setErrorMonthlySummary] = useState<string | null>(
    null,
  );

  const monthlySummaryQuery = api.analyticsGeneral.monthlySummary.useQuery(
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
    if (monthlySummaryQuery.data) {
      const data = monthlySummaryQuery.data.map((d) => ({
        monthStartDate: d.month_start_date,
        "Total Orders": d.shopify_total_orders,
        "Total Revenue": d.shopify_total_order_value,
        "Total New Customer Orders": d.shopify_total_first_orders,
        "Total New Customer Revenue": d.shopify_total_first_order_value,
        "Industry Average NCR %": industryAverageNewCustomerRevenuePct,
        "New Customer Revenue %":
          d.shopify_total_first_order_value / d.shopify_total_order_value,
      }));

      const dataWithMonthName = tidy(
        data,
        mutate({
          "Month Name": (d) =>
            d.monthStartDate.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            }),
        }),
      );

      if (!dataWithMonthName[0]) {
        setErrorMonthlySummary(
          "No data found for the provided store prefix and date range.",
        );
        return;
      }

      setMonthlySummary(dataWithMonthName);
      setIsLoadingMonthlySummary(false);
    }
  }, [monthlySummaryQuery.data]);

  return {
    monthlySummary,
    isLoadingMonthlySummary,
    errorMonthlySummary,
    refetchMonthlySummary: monthlySummaryQuery.refetch,
  };
};
