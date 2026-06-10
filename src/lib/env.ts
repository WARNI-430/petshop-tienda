import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  CJ_API_EMAIL: z.string().email(),
  CJ_API_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().optional().default(""),
  RESEND_FROM: z.string().optional().default("noreply@mitienda.com"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  ADMIN_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
