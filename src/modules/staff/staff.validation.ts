import { z } from "zod";

export const staffValidationSchema = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
      serviceType: z.string().min(1, "Service type is required"),
      dailyCapacity: z.number().optional(),
      availabilityStatus: z.enum(["Available", "On Leave"]).optional(),
    }),
  }),
  updateStatus: z.object({
    body: z.object({
      status: z.enum(["Available", "On Leave"]),
    }),
  }),
};
