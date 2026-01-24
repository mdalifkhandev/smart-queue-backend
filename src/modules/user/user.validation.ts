import { z } from "zod";

export const userValidationSchema = {
  register: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    }),
  }),
  login: z.object({
    body: z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
    }),
  }),
};
