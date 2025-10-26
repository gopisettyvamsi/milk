import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or empty JSON body" },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, status } = body || {};

    if (!razorpay_order_id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const existing = await db("payment_history")
      .where({ order_id: razorpay_order_id })
      .first();

    if (!existing) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (["FAILED", "SUCCESS", "REFUNDED"].includes(existing.payment_status)) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: `Skipped update — already ${existing.payment_status}`,
      });
    }

    // ✅ SUCCESS
    if (status === "SUCCESS" && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, message: "Invalid Razorpay Signature" }, { status: 400 });
      }

      await db("payment_history")
        .where({ order_id: razorpay_order_id })
        .update({
          transaction_id: razorpay_payment_id,
          payment_status: "SUCCESS",
          mail_status: "SUCCESS_SENT",
        });

      return NextResponse.json({ success: true, verified: true, message: "Payment success updated" });
    }

    // ✅ FAILED
    if (status === "FAILED") {
      await db("payment_history")
        .where({ order_id: razorpay_order_id })
        .update({
          transaction_id: razorpay_payment_id || null,
          payment_status: "FAILED",
          mail_status: "FAILED_SENT",
        });

      return NextResponse.json({ success: true, verified: true, message: "Payment failed updated" });
    }

    // ✅ PENDING
    if (status === "PENDING") {
      await db("payment_history")
        .where({ order_id: razorpay_order_id })
        .update({
          transaction_id: razorpay_payment_id || null,
          payment_status: "PENDING",
          mail_status: "PENDING_WAIT",
        });

      // 🕒 2-minute console timer + delayed pending-mail trigger
      const totalSeconds = 60;
      let remaining = totalSeconds;

      console.log(`⏳ Pending email countdown started for order ${razorpay_order_id} (${totalSeconds}s)`);

      const interval = setInterval(() => {
        remaining -= 10;
        console.log(`⏱️ Pending mail for ${razorpay_order_id} in ${remaining}s`);
      }, 10000);

      setTimeout(async () => {
        clearInterval(interval);
        console.log(`🚀 Triggering pending mail for ${razorpay_order_id} now...`);
        try {
          const current = await db("payment_history")
            .where({ order_id: razorpay_order_id })
            .first();

          if (current && current.payment_status === "PENDING" && current.mail_status !== "PENDING_SENT") {
            await fetch(`${process.env.APP_URL}/api/payments/pending-check`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order_id: razorpay_order_id }),
            });
            console.log(`📨 Pending email triggered for order ${razorpay_order_id}`);
          } else {
            console.log(`✅ Skipped: status is now ${current?.payment_status}`);
          }
        } catch (err) {
          console.error("❌ Error triggering delayed pending mail:", err);
        }
      }, totalSeconds * 1000);

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Payment marked pending; mail will trigger after 2 mins",
      });
    }

    return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
  } catch (err: any) {
    console.error("Verify Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
