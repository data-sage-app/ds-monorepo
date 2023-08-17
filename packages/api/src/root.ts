import { analyticsShopifyRouter } from "./router/analyticsShopify";
import { authRouter } from "./router/auth";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  analyticsShopify: analyticsShopifyRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
