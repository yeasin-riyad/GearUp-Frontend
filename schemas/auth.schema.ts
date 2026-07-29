// src/schemas/auth.schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(
      /^01[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number (e.g., 01812345678)",
    ),
  role: z.enum(["CUSTOMER", "PROVIDER"], {
    error: () => ({ message: "Please select a valid role" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;