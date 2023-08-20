import { analyticsGeneralRouter } from "./router/analyticsGeneral";
import { costOfDeliveryRouter } from "./router/costOfDelivery";
import { organizationRouter } from "./router/organization";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  analyticsGeneral: analyticsGeneralRouter,
  organization: organizationRouter,
  costOfDelivery: costOfDeliveryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
