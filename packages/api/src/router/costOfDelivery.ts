import { createTRPCRouter, protectedProcedure } from "../trpc";

import { createCostOfDeliveryInput } from "../schemas";
import { z } from "zod";

export const costOfDeliveryInput = z.object({
  name: z.string(),
  value: z.number(),
});

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
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        value: z.number(),
      }),
    )
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
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.costOfDeliveryLineItems.delete({
        where: {
          id: input.id,
        },
      });
    }),

  selectCostOfDelivery: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        value: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.costOfDeliveryLineItems.findMany({
        where: {
          organizationId: ctx.auth.organization?.id,
          name: input.name,
          value: input.value,
        },
      });
    }),
});
