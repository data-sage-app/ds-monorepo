import { analyticsShopifyRouter } from "./router/analyticsShopify";
import { authRouter } from "./router/auth";
import { costOfDeliveryRouter } from "./router/costOfDelivery";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  analyticsShopify: analyticsShopifyRouter,
  auth: authRouter,
  costOfDelivery: costOfDeliveryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
