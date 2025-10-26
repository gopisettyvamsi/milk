import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse Request
    const body = await req.json();
    console.log("📥 Capture Payment Request Body:", body);

    const { order_id, transaction_id, payment_status } = body;

    // 2️⃣ Validate Input
    if (!order_id || !payment_status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3️⃣ Determine mail_status based on payment_status
    let mailStatus: string | null = null;
    switch (payment_status) {
      case "SUCCESS":
        mailStatus = "SUCCESS_SENT";
        break;
      case "FAILED":
        mailStatus = "FAILED_SENT";
        break;
      case "PENDING":
        mailStatus = "PENDING_SENT"; // pending mail will be sent later by /pending-check
        break;
      default:
        mailStatus = null;
    }

    // 4️⃣ Update DB record
    const updated = await db("payment_history")
      .where({ order_id })
      .update({
        transaction_id: transaction_id || null,
        payment_status,
        mail_status: mailStatus,
      });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Order not found or not updated" },
        { status: 404 }
      );
    }

    console.log(`💾 Payment updated: ${order_id} → ${payment_status} (${mailStatus || "no mail yet"})`);

    // 5️⃣ Response
    return NextResponse.json({
      success: true,
      message: `Payment ${payment_status} captured successfully`,
    });
  } catch (error: any) {
    console.error("🚨 Capture Payment Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
