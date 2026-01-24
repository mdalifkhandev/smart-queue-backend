import { z } from "zod";

export const serviceValidationSchema = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
      duration: z.number().min(1, "Duration must be at least 1 minute"),
      staffType: z.string().min(1, "Staff Type is required"),
    }),
  }),
};
