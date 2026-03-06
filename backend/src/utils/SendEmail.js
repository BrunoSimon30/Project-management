import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import constants from "../constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: constants.SMTP_HOST,
  port: constants.SMTP_PORT,
  secure: true,
  auth: {
    user: constants.SMTP_USER,
    pass: constants.SMTP_PASS,
  },
});

const getOtpTemplate = (otpcode) => {
  const templatePath = path.join(__dirname, "template", "OtpEmail.html");
  let template = fs.readFileSync(templatePath, "utf-8");
  return template.replace(/\{\{otpcode\}\}/g, otpcode);
};

const sendEmail = async (toEmail, subject, otpcode, callback) => {
  const html = getOtpTemplate(otpcode);
  try {
    const info = await transporter.sendMail({
      from: '"Email OTP Verification" <reply@raizety.com>',
      to: toEmail,
      subject: subject,
      text: `Your OTP is: ${otpcode}. It expires in 5 minutes.`,
      html: html,
    });
    if (typeof callback === "function") callback(null);
    return info;
  } catch (err) {
    console.log(err);
    if (typeof callback === "function") callback(err);
    throw err;
  }
};

export { sendEmail };