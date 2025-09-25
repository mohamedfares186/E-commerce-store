import nodemailer from "nodemailer";
import env from "../config/env.mjs";
import { logger } from "../middleware/logger.mjs";

const sendEmail = async (email, subject, text) => {
  // Check if email configuration is available
  if (!env.emailHost || !env.emailUser || !env.emailPass) {
    logger.warn("Email configuration not available, skipping email send");
    return { message: "Email configuration not available" };
  }

  const transporter = nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    auth: {
      user: env.emailUser,
      pass: env.emailPass,
    },
  });
  const mailOptions = {
    from: env.emailUser,
    to: email,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent: ", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error("Error sending email: ", error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;