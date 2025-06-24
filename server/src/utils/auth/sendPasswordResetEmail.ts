import { env } from "../../config/env";
import { genericMailSender } from "../genericMailSender";

const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const frontendRedirector = `${env.FRONTEND_HOST}/account/reset-password?tk=${token}`;
  await genericMailSender({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: passwordResetEmailTemplate(name, frontendRedirector),
  });
};

const passwordResetEmailTemplate = (
  name: string,
  resetLink: string
): string => `
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Reset Your Password</title>
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
       .button {
         display: inline-block;
         margin-top: 20px;
         padding: 12px 20px;
         background-color: #0b5ed7;
         color: #ffffff !important;
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
       <h2>Password Reset Request</h2>
       <p>👋 Hi ${name},</p>
       <p>We received a request to reset your password. Click the button below to reset it:</p>
       <a href="${resetLink}" class="button">Reset Password</a>
       <p>If you didn't request this, you can safely ignore this email.</p>
       <p>Thank you,<br/>The Team</p>
       <div class="footer">
         This link will expire in 10 minutes for your security.
       </div>
     </div>
   </body>
   </html>
  `;

export default sendPasswordResetEmail;
