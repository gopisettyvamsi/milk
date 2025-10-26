import { NextResponse } from "next/server";
import db from "@/lib/db";
import { renderEmailTemplate } from "@/lib/contactTemplate";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: "Missing order_id" },
        { status: 400 }
      );
    }

    const order = await db("payment_history").where({ order_id }).first();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // 1. Stop if already finalized
    if (["SUCCESS", "FAILED", "REFUNDED"].includes(order.payment_status)) {
      return NextResponse.json({
        success: true,
        status: order.payment_status,
        message: `Order already ${order.payment_status}`,
      });
    }

    // 2. Skip if pending mail already sent
    if (order.mail_status === "PENDING_SENT") {
      return NextResponse.json({
        success: true,
        status: "PENDING",
        message: "Pending mail already sent",
      });
    }

    // 3. Still pending - send reminder email
    const user = await db("users").where({ id: order.user_id }).first();
    const event = await db("events_data").where({ id: order.event_id }).first();

    if (!user || !event) {
      return NextResponse.json(
        { success: false, message: "User or Event not found" },
        { status: 404 }
      );
    }

    const name = user.name || "Participant";
    const email = user.email;
    const event_title = event.event_title || "Event";
    const amount = order.amount;

    // 4. Render pending template
    const html = await renderEmailTemplate("paymentPending", {
      name,
      event_title,
      amount,
      transaction_id: order.transaction_id || "N/A",
      order_id,
      payment_status: "PENDING",
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
      event_slug: event_title.replace(/\s+/g, "-").toLowerCase(),
      currentYear: new Date().getFullYear(),
    });

    // 5. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"Organization Events" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: `Payment Pending - ${event_title}`,
      html,
    });

    // 6. Update mail_status to prevent duplicate emails
    await db("payment_history")
      .where({ order_id })
      .update({ mail_status: "PENDING_SENT" });

    return NextResponse.json({
      success: true,
      status: "PENDING",
      message: "Pending email sent successfully",
    });
  } catch (error: any) {
    console.error("Pending Check Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}