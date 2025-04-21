import { z } from "zod";

const emailSchema = z.string().email().min(1).max(25);
const passwordschema = z.string().min(6).max(225);
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordschema,
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(6).max(225),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmpassword"], //path: The field that caused the error. This points to the confirmPassword field, so that the validation error is attached to it.
  });
