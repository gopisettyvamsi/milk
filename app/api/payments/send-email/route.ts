import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderEmailTemplate } from "@/lib/contactTemplate";

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      name,
      event_title,
      amount,
      transaction_id,
      payment_status,
      order_id,
    } = await req.json();

    // ✅ Choose template & subject dynamically
    let templateName = "paymentPending";
    let subjectPrefix = "Payment Pending";

    switch (payment_status) {
      case "SUCCESS":
        templateName = "paymentSuccess";
        subjectPrefix = "Payment Successful";
        break;
      case "FAILED":
        templateName = "paymentFailed";
        subjectPrefix = "Payment Failed";
        break;
      case "REFUNDED":
        templateName = "paymentRefunded";
        subjectPrefix = "Payment Refunded";
        break;
      default:
        templateName = "paymentPending";
        subjectPrefix = "Payment Pending";
    }

    // ✅ Render email body with dynamic placeholders
    const html = await renderEmailTemplate(templateName, {
      name,
      event_title,
      amount,
      transaction_id: transaction_id || "—",
      order_id: order_id || "—",
      payment_status,
      payment_date: new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      appUrl: process.env.APP_URL,
      event_slug: event_title?.replace(/\s+/g, "-").toLowerCase(),
      currentYear: new Date().getFullYear(),
    });

    // ✅ Outlook / Office 365 SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g. smtp.office365.com
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // STARTTLS (recommended for Outlook)
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // ✅ Send the email
    await transporter.sendMail({
      from: `"Organization Events" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: `${subjectPrefix} - ${event_title}`,
      html,
    });

    console.log(`📨 Email sent to ${email} for ${payment_status}`);

    return NextResponse.json({
      success: true,
      message: `Email sent successfully for status: ${payment_status}`,
    });
  } catch (error: any) {
    console.error("📧 Email Sending Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send payment email",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
