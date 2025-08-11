import { z } from "zod";
import { validate } from "../middlewares/validate";

export const createApplicationSchema = z.object({
  jobId: z.string().cuid(),
  userId: z.string().uuid(),
});

export const validateCreateApplication = validate(createApplicationSchema);
