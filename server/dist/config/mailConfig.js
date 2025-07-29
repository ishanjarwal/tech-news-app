"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.EMAIL_PROVIDER,
    port: Number(env_1.env.EMAIL_PORT),
    secure: false, // set true on production and switch the port to 465
    auth: {
        user: env_1.env.EMAIL_USER,
        pass: env_1.env.EMAIL_PASSWORD,
    },
});
exports.default = transporter;
