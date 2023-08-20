import { createTRPCRouter, protectedProcedure } from "../trpc";

export const organizationRouter = createTRPCRouter({
  getOrganizationShopifyPrefix: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.organization.findUnique({
      where: {
        id: ctx.auth.organization?.id,
      },
    });
  }),
});
