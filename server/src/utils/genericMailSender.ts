import transporter from "../config/mailConfig";

interface MailOptions {
  from: string;
  to: string | string[];
  html: string;
  text?: string;
  subject: string;
}

export const genericMailSender = async (options: MailOptions) => {
  const { from, to, html, text, subject } = options;
  await transporter.sendMail({
    to: Array.isArray(to) ? to.join(", ") : to,
    from,
    subject,
    html,
    text,
  });
};
