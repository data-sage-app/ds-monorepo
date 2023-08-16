import { authRouter } from "./router/auth";
import { costOfDeliveryRouter } from "./router/costOfDelivery";
import { createTRPCRouter } from "./trpc";
import { postRouter } from "./router/post";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  costOfDelivery: costOfDeliveryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
