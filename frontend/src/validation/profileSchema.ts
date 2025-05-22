import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Invalid phone number"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
