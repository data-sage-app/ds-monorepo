import {
  createCostOfDeliveryInput,
  deleteCostOfDeliveryInput,
  selectCostOfDeliveryInput,
} from "../schemas/costOfDeliverySchemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const costOfDeliveryRouter = createTRPCRouter({
  getCostOfDelivery: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.costOfDeliveryLineItems.findMany({
      where: {
        organizationId: ctx.auth.organization?.id,
      },
    });
  }),

  createCostOfDelivery: protectedProcedure
    .input(createCostOfDeliveryInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.costOfDeliveryLineItems.create({
        data: {
          name: input.name,
          value: input.value,
          organizationId: ctx.auth.organization?.id,
        },
      });
    }),

  getTotalCostOfDelivery: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.costOfDeliveryLineItems.aggregate({
      _sum: {
        value: true,
      },
      where: {
        organizationId: ctx.auth.organization?.id,
      },
    });
  }),

  updateCostOfDelivery: protectedProcedure
    .input(selectCostOfDeliveryInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.costOfDeliveryLineItems.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          value: input.value,
        },
      });
    }),

  deleteCostOfDelivery: protectedProcedure
    .input(deleteCostOfDeliveryInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.costOfDeliveryLineItems.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
