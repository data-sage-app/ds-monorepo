import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

type AllTimeSummary = {
  ds_shopify_prefix: string;
  ds_clerk_org_id: string;
  shopify_total_orders: number;
  shopify_total_order_value: number;
  shopify_total_first_orders: number;
  shopify_total_first_order_value: number;
};

type MonthlySummary = {
  ds_shopify_prefix: string;
  ds_clerk_org_id: string;
  month_start_date: Date;
  shopify_total_orders: number;
  shopify_total_order_value: number;
  shopify_total_first_orders: number;
  shopify_total_first_order_value: number;
};

type DailySummary = {
  ds_shopify_prefix: string;
  ds_clerk_org_id: string;
  date: Date;
  shopify_total_orders: number;
  shopify_total_order_value: number;
  shopify_total_first_orders: number;
  shopify_total_first_order_value: number;
};

export const analyticsGeneralRouter = createTRPCRouter({
  allTimeSummary: protectedProcedure
    .input(
      z.object({
        storePrefix: z.string(),
      }),
    )
    .query(async ({ ctx }) => {
      const result = await ctx.prisma.$queryRaw<AllTimeSummary[]>`
        SELECT * FROM dbt_marts.all_time_summary
        WHERE ds_clerk_org_id = ${ctx.auth.orgId}`;

      const transformedResult = result.map((record) => ({
        ...record,
        total_orders: Number(record.shopify_total_orders),
        total_first_orders: Number(record.shopify_total_first_orders),
      }));

      return transformedResult;
    }),

  monthlySummary: protectedProcedure
    .input(
      z.object({
        storePrefix: z.string(),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const fromDate = input.fromDate;
      const toDate = input.toDate || new Date();

      const result = await ctx.prisma.$queryRaw<MonthlySummary[]>`
        SELECT * FROM dbt_marts.monthly_summary
        WHERE ds_clerk_org_id = ${ctx.auth.orgId}
        ORDER BY month_start_date ASC`;

      const transformedResult = result.map((record) => ({
        ...record,
        total_orders: Number(record.shopify_total_orders),
        total_first_orders: Number(record.shopify_total_first_orders),
      }));

      return transformedResult;
    }),
  dailySummary: protectedProcedure
    .input(
      z.object({
        storePrefix: z.string(),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const fromDate = input.fromDate;
      const toDate = input.toDate || new Date();

      const result = await ctx.prisma.$queryRaw<DailySummary[]>`
        SELECT * FROM dbt_marts.daily_summary 
        WHERE ds_clerk_org_id = ${ctx.auth.orgId}
        ORDER BY date ASC`;

      const transformedResult = result.map((record) => ({
        ...record,
        total_orders: Number(record.shopify_total_orders),
        total_first_orders: Number(record.shopify_total_first_orders),
      }));

      return transformedResult;
    }),
});
