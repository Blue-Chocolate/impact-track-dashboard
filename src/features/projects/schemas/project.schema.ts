import { z } from "zod";

/**
 * Project form schema (Zod)
 */
export const projectFormSchema = z.object({
  name: z
    .string()
    .min(3, "Project title must be at least 3 characters")
    .max(200, "Title too long"),
  description: z.string().optional().nullable(),
  startDate: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: "Invalid start date" }),
  endDate: z
    .string()
    .optional()
    .nullable()
    .refine((s) => !s || !isNaN(Date.parse(s)), {
      message: "Invalid end date",
    })
    .refine((s, ctx) => {
      // if endDate present ensure it's not before startDate (handled in form where both known)
      return true;
    }),
  status: z.enum(["planned", "active", "completed"], {
    errorMap: () => ({ message: "Select a valid status" }),
  }),
  budget: z
    .number({ invalid_type_error: "Budget must be a number" })
    .min(0, "Budget cannot be negative")
    .optional()
    .nullable(),
  mainKPI: z
    .number({ invalid_type_error: "Main KPI must be a number" })
    .min(0, "KPI cannot be negative")
    .optional()
    .nullable(),
});

// Type used by the form (input shape)
export type ProjectFormInput = z.infer<typeof projectFormSchema>;
