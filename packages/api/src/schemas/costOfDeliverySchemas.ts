import { z } from "zod";

export const createCostOfDeliveryInput = z.object({
  name: z.string().min(1, "Cost name is required"),
  value: z.number().positive("Amount should be positive"),
});

export const selectCostOfDeliveryInput = z.object({
  id: z.number().min(1, "Id should be positive"),
  name: z.string().min(1, "Cost name is required"),
  value: z.number().positive("Amount should be positive"),
});

export const deleteCostOfDeliveryInput = z.object({
  id: z.number(),
});
