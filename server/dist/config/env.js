"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().transform(Number).default("8080"),
    ENVIRONMENT: zod_1.z.enum(["production", "development"]),
    FRONTEND_HOST: zod_1.z.string().nonempty(),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]),
    DB_URL: zod_1.z.string().nonempty(),
    EMAIL_USER: zod_1.z.string().email().nonempty(),
    EMAIL_FROM: zod_1.z.string().email().nonempty(),
    EMAIL_PASSWORD: zod_1.z.string().nonempty(),
    EMAIL_PORT: zod_1.z.coerce.number(),
    EMAIL_PROVIDER: zod_1.z.string().nonempty(),
    SALT_ROUNDS: zod_1.z.coerce.number(),
    JWT_PASSWORD_SECRET: zod_1.z.string().nonempty(),
    JWT_ACCESS_TOKEN_SECRET: zod_1.z.string().nonempty(),
    JWT_REFRESH_TOKEN_SECRET: zod_1.z.string().nonempty(),
    JWT_PASSWORD_RESET_SECRET: zod_1.z.string().nonempty(),
    GOOGLE_CLIENT_ID: zod_1.z.string().nonempty(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().nonempty(),
    GOOGLE_CALLBACK_URL: zod_1.z.string().nonempty(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().nonempty(),
    CLOUDINARY_API_KEY: zod_1.z.string().nonempty(),
    CLOUDINARY_API_SECRET: zod_1.z.string().nonempty(),
    CLOUDINARY_ROOT_FOLDER: zod_1.z.string().nonempty(),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    process.exit(1);
}
exports.env = parsedEnv.data;
