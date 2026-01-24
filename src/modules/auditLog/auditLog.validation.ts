import { z } from "zod";

export const auditLogValidationSchema = {
  create: z.object({
    body: z.object({
      action: z.string().min(1, "Action is required"),
      details: z.string().min(1, "Details are required"),
    }),
  }),
};
