import { RequestHandler } from "express";
import User from "../models/User";
import { genericMailSender } from "../utils/genericMailSender";
import { env } from "../config/env";

// grant write privilleges to author
export const grantAuthorPrivilleges: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.error(404, "error", "User doesn't exist", null);
      return;
    }
    if (user.roles.includes("author")) {
      res.error(404, "error", "Author privilleges already granted", null);
      return;
    }
    user.roles = [...user.roles, "author"];
    await user.save();
    await genericMailSender({
      to: user.email,
      from: env.EMAIL_FROM,
      subject: "Author Privilleges",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>You Are Now an Author!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 30px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      color: #2c3e50;
    }
    .highlight {
      color: #27ae60;
      font-weight: bold;
    }
    .guidelines {
      margin-top: 20px;
      padding-left: 20px;
    }
    .guidelines li {
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #7f8c8d;
      text-align: center;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #2980b9;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
    }
    a {
      color: #2980b9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="header">🎉 Congratulations!</h2>
    <p>Hello <strong>${user.fullname}</strong>,</p>

    <p>You have been granted <span class="highlight">author privileges</span> on our blogging platform. You can now create, edit, and publish blog posts directly from your dashboard.</p>

    <p>Before you begin, please take a moment to review the following guidelines to ensure quality and consistency:</p>

    <ul class="guidelines">
      <li>✅ Ensure your posts are original and not plagiarized.</li>
      <li>✅ Use proper grammar, punctuation, and formatting.</li>
      <li>✅ Include a featured image and relevant tags.</li>
      <li>✅ Avoid offensive or discriminatory content.</li>
      <li>✅ Cite your sources where applicable.</li>
    </ul>

    <p>We value high-quality content and a respectful writing environment. Failure to comply with the guidelines may result in revocation of author privileges.</p>

    <p>You can start writing your first blog here:</p>
    <a href="#" class="btn">Go to Author Dashboard</a>

    <p class="footer">If you have any questions, feel free to contact us at <a href="mailto:ishucodes@gmail.com">ishucodes@gmail.com</a></p>
  </div>
</body>
</html>
`,
    });
    res.success(
      200,
      "success",
      `Author privilleges granted to ${user.fullname}`,
      null
    );
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};

// revoke author privilleges
export const revokeAuthorPrivilleges: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.error(404, "error", "User doesn't exist", null);
      return;
    }
    if (!user.roles.includes("author")) {
      res.error(404, "error", "Author privilleges not found", null);
      return;
    }
    user.roles = [...user.roles].filter((el) => el != "author");
    await user.save();
    await genericMailSender({
      to: user.email,
      from: env.EMAIL_FROM,
      subject: "Author Privilleges",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Author Access Revoked</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 30px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      color: #c0392b;
    }
    .highlight {
      color: #c0392b;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #7f8c8d;
      text-align: center;
    }
    a {
      color: #2980b9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="header">⚠️ Author Privileges Revoked</h2>
    <p>Hello <strong>${user.fullname}</strong>,</p>

    <p>We want to inform you that your <span class="highlight">author privileges have been revoked</span> on our blogging platform, effective immediately.</p>

    <p>This decision may have been made due to one or more of the following reasons:</p>

    <ul style="margin-left: 20px;">
      <li>❌ Violation of content guidelines or platform rules</li>
      <li>❌ Plagiarized or inappropriate content</li>
      <li>❌ Repeated submission of low-quality posts</li>
    </ul>

    <p>If you believe this was a mistake or would like clarification, feel free to reach out to us.</p>

    <p>We appreciate your contributions and encourage you to remain part of our community in other capacities.</p>

    <p class="footer">For further assistance, contact <a href="mailto:support@example.com">support@example.com</a></p>
  </div>
</body>
</html>
`,
    });
    res.success(
      200,
      "success",
      `Author privilleges revoked from ${user.fullname}`,
      null
    );
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
