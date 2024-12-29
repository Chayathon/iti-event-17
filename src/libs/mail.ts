import path from "path";
import { promises as fs } from "fs";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export interface MailData {
  email?: string;
  name?: string;
  date?: string;
  paymentMethod?: string;
  reservationId?: string;
  reservationType?: "จองโต๊ะ" | "จองสินค้า";
  detail?: string;
  generation: number;
}

export async function mail(data: MailData) {
  const {
    email,
    name,
    date,
    paymentMethod,
    reservationId,
    reservationType,
    detail,
  } = data;

  const mailPathFile = path.join(process.cwd(), "public", "mail.html");
  const imagePath = path.join(process.cwd(), "public", "thank-you.png");
  const mail = await fs.readFile(mailPathFile, "utf-8");
  const image = await fs.readFile(imagePath);

  const mailOptions: SMTPTransport.MailOptions = {
    from: {
      name: `ITI สานสัมพันธ์ ครั้งที่ 17`,
      address: process.env.EMAIL_FROM as string,
    }, // Replace with your email address
    to: email,
    subject: "🤝 ขอบคุณสำหรับการชำระเงิน งานสานสัมพันธ์ ครั้งที่ 17",
    envelope: {
      from: process.env.EMAIL_FROM as string,
      to: email,
    },
    html: mail
      .replace(/#NAME#/g, name)
      .replace(/#DATETIME#/g, date)
      .replace(/#METHOD_PAYMENT#/g, paymentMethod)
      .replace(/#RESERVATION_ID#/g, reservationId)
      .replace(/#RESERVATION_TYPE#/g, reservationType)
      .replace(/#GENERATION#/g, data.generation.toString())
      .replace(/#DETAIL#/g, detail),
  };

  return sendMail(mailOptions);
}

async function sendMail(mailOptions: SMTPTransport.MailOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'Gmail' or use a custom SMTP configuration
    auth: {
      user: process.env.EMAIL_FROM as string, // Replace with your email address
      pass: process.env.EMAIL_SERVER_PASSWORD as string, // Replace with your email password or an app password for security
    },
  });
  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("Mail sent:", info);

    return info.response;
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
}
