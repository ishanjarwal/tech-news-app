import { env } from "../../config/env";
import transporter from "../../config/mailConfig";

function generateRandomPassword(length: number = 8): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    password += letters[randomIndex];
  }

  return password;
}

const sendGoogleAutogenPassword = async (
  email: string,
  name: string,
  password: string
) => {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Welcome! Your Auto-generated Password",
    html: googleAuthEmailTemplate(name, password),
  });

  return password;
};

const googleAuthEmailTemplate = (name: string, password: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Our Platform</title>
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
    .password {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 20px 0;
      background-color: #f0f0f0;
      padding: 10px 20px;
      display: inline-block;
      border-radius: 5px;
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
    <h2>Welcome, ${name}!</h2>
    <p>Thank you for signing in using your Google account.</p>
    <p>To access your account directly next time, you can use the following auto-generated password:</p>
    <div class="password">${password}</div>
    <p>You can change this password anytime from your account settings.</p>
    <p>Thank you,<br/>Passport Auth Project</p>
    <div class="footer">
      If you did not attempt to log in, please contact support immediately.
    </div>
  </div>
</body>
</html>
`;

export default sendGoogleAutogenPassword;
