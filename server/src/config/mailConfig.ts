import nodemailer from "nodemailer";
import { env } from "./env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_PROVIDER,
  port: Number(env.EMAIL_PORT),
  secure: false, // set true on production and switch the port to 465
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

export default transporter;
