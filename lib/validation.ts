import * as z from 'zod';

export const registerSchema = z.object({
 name: z.string().min(2, "First name is required"),
  license_number: z.string().min(5, "Licence number is required"),
  license_details: z.string().min(2, "Licence description is required"),
  phone_number: z.string().min(11, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export type RegisterData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});