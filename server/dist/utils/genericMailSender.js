"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericMailSender = void 0;
const mailConfig_1 = __importDefault(require("../config/mailConfig"));
const genericMailSender = async (options) => {
    const { from, to, html, text, subject } = options;
    await mailConfig_1.default.sendMail({
        to: Array.isArray(to) ? to.join(", ") : to,
        from,
        subject,
        html,
        text,
    });
};
exports.genericMailSender = genericMailSender;
