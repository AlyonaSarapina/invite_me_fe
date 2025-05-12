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
  date_of_birth: z.string().optional(),
  role: z.enum(["client", "owner"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});
