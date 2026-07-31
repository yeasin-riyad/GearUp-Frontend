import { z } from "zod";

export const gearSchema = z.object({
  name: z.string().min(1, "Gear name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  brand: z.string().optional(),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(3, "Please upload at least 3 images"),
  features: z
    .array(z.string().min(1, "Feature cannot be empty"))
    .min(1, "Please add at least one feature"),
  pricePerDay: z.number().min(0.01, "Price must be greater than 0"),
  deposit: z.number().min(0, "Deposit must be 0 or greater"),
  stock: z.number().int().min(1, "Stock must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
});

export type GearFormValues = z.infer<typeof gearSchema>;