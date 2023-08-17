import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

type ShopifyProduct = {
  title: string;
  status: string;
  vendor: string;
}

type ShopifyProductCount = {
  total_products: number;
}

export const analyticsShopifyRouter = createTRPCRouter({
  getProductList: protectedProcedure.query(( { ctx }) => {    
    return ctx.prisma.$queryRaw<ShopifyProduct[]>`SELECT title, status, vendor from dbt_ods.shopify_products where ds_clerk_org_id = ${ctx.auth.orgId}`
  })
});
