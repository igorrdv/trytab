import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  location: z.string().min(2, "Location must be provided"),
  type: z.enum(["full-time", "part-time", "contract"]).default("full-time"),
  salary: z.string().optional(),
  remote: z.boolean().default(false),
  companyId: z.string().uuid("Invalid company ID"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
