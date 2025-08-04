import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.number().int(),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
