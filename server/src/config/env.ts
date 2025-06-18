import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default("8080"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DB_URL: z.string().nonempty(),
  EMAIL_USER: z.string().email().nonempty(),
  EMAIL_FROM: z.string().email().nonempty(),
  EMAIL_PASSWORD: z.string().nonempty(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_PROVIDER: z.string().nonempty(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
