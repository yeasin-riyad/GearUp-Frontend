import * as z from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().optional(),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .or(z.literal(""))
    .optional(),
  avatar: z
    .string()
    .url("Please enter a valid image URL")
    .or(z.literal(""))
    .optional(),
  address: z
    .string()
    .max(100, "Address is too long")
    .or(z.literal(""))
    .optional(),
  city: z
    .string()
    .max(50, "City is too long")
    .or(z.literal(""))
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;