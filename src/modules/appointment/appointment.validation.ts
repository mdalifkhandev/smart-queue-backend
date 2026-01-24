import { z } from "zod";

export const appointmentValidationSchema = {
  create: z.object({
    body: z.object({
      customerName: z.string().min(1, "Customer name is required"),
      serviceId: z.string().min(1, "Service ID is required"),
      staffId: z.string().optional(),
      appointmentDate: z
        .string()
        .or(z.date())
        .refine((val) => !isNaN(Date.parse(val.toString())), {
          message: "Invalid date format",
        }),
    }),
  }),
  updateStatus: z.object({
    body: z.object({
      status: z.enum([
        "Scheduled",
        "Completed",
        "Cancelled",
        "No-Show",
        "Waiting",
      ]),
    }),
  }),
  assignQueue: z.object({
    body: z.object({
      staffId: z.string().min(1, "Staff ID is required"),
    }),
  }),
};
