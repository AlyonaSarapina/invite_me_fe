import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^A-Za-z0-9]/, "Must include a special character"),
  phone: z.string().min(5, "Phone number is required"),
  date_of_birth: z
    .string()
    .refine(
      (date) => {
        if (!date) return true;
        return new Date(date) <= new Date();
      },
      {
        message: "Date of birth cannot be in the future",
      }
    )
    .optional(),
  role: z.enum(["client", "owner"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});
