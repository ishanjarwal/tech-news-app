"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../config/env");
const genericMailSender_1 = require("../genericMailSender");
const generateOTP_1 = require("./generateOTP");
const OTPSender = async (email, name) => {
    const otp = (0, generateOTP_1.generateOTP)(4);
    const frontendRedirector = env_1.env.FRONTEND_HOST + "/account/verify?email=" + email;
    await (0, genericMailSender_1.genericMailSender)({
        from: env_1.env.EMAIL_FROM,
        to: email,
        subject: "Verify your account",
        html: otpEmailTemplate(name, otp.toString(), frontendRedirector),
    });
    return otp;
};
const otpEmailTemplate = (name, otp, redirectUrl) => `
 <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <title>Verify your account</title>
   <style>
     body {
       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       background-color: #f9f9f9;
       color: #333;
       margin: 0;
       padding: 0;
     }
     .container {
       max-width: 500px;
       margin: 40px auto;
       background-color: #ffffff;
       border-radius: 8px;
       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
       padding: 30px;
     }
     h2 {
       color: #0b5ed7;
     }
     .otp {
       font-size: 24px;
       font-weight: bold;
       letter-spacing: 4px;
       margin: 20px 0;
       background-color: #f0f0f0;
       padding: 10px 20px;
       display: inline-block;
       border-radius: 5px;
     }
     .button {
       display: inline-block;
       margin-top: 20px;
       padding: 12px 20px;
       background-color: #0b5ed7;
       color: #fff;
       text-decoration: none;
       border-radius: 5px;
       font-weight: bold;
     }
     .footer {
       margin-top: 30px;
       font-size: 13px;
       color: #888;
       text-align: center;
     }
   </style>
 </head>
 <body>
   <div class="container">
     <h2>Email Verification</h2>
     <p>👋 Hi ${name},</p>
     <p>Use the following One-Time Password (OTP) to complete your verification:</p>
     <div class="otp">${otp}</div>
     <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
     <a href="${redirectUrl}" class="button">Continue to Verification</a>
     <p>Thank you,<br/>The Team</p>
     <div class="footer">
       If you did not request this, you can safely ignore this email.
     </div>
   </div>
 </body>
 </html>
 `;
exports.default = OTPSender;
