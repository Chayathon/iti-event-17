import path from "path";
import { promises as fs } from "fs";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export interface MailData {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  reservationType?: "จองโต๊ะ" | "จองสินค้า";
  detail?: string;
  trackingCode?: string;
}

export async function mail(data: MailData) {
  const {
    email,
    name,
    phone,
    address,
    reservationType,
    detail,
    trackingCode,
  } = data;

  const mailPathFile = path.join(process.cwd(), "public", "mailProduct.html");
  const mail = await fs.readFile(mailPathFile, "utf-8");

  const mailOptions: SMTPTransport.MailOptions = {
    from: {
      name: `ITI สานสัมพันธ์ ครั้งที่ 17`,
      address: process.env.EMAIL_FROM as string,
    }, // Replace with your email address
    to: email,
    subject: "🚚 สินค้าของคุณ กำลังจัดส่ง",
    envelope: {
      from: process.env.EMAIL_FROM as string,
      to: email,
    },
    html: mail
      .replace(/#RESERVATION_TYPE#/g, reservationType)
      .replace(/#NAME#/g, name)
      .replace(/#PHONE#/g, phone)
      .replace(/#ADDRESS#/g, address)
      .replace(/#DETAIL#/g, detail)
      .replace(/#TRACKING_CODE#/g, trackingCode),
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
