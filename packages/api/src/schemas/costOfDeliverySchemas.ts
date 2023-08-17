import { z } from "zod";

export const createCostOfDeliveryInput = z.object({
  name: z.string().min(1, "Cost name is required"),
  value: z.number().positive("Amount should be positive"),
});

export const selectCostOfDeliveryInput = z.object({
  id: z.number(),
  name: z.string(),
  value: z.number(),
});

export const deleteCostOfDeliveryInput = z.object({
  id: z.number(),
});
