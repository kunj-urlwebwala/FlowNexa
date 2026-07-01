import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { logger } from "../../config/logger";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth:
    env.SMTP_USER && env.SMTP_PASS
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
});

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
    logger.debug({ messageId: info.messageId, to }, "Email sent successfully");
    return true;
  } catch (error) {
    logger.error({ error, to, subject }, "Failed to send email");
    return false;
  }
}
