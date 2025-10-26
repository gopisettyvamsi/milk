import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse the incoming request body
    const body = await req.json();
    console.log("📥 Create Order Request:", body);

    const { amount, currency, user_id, event_id } = body;

    // 2️⃣ Validate input
    if (!amount || !user_id || !event_id) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (amount, user_id, event_id)" },
        { status: 400 }
      );
    }

    // 3️⃣ Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 4️⃣ Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert INR → paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order Created:", order.id);

    // 5️⃣ Insert into database with PENDING status
    await db("payment_history").insert({
      user_id,
      event_id,
      order_id: order.id,
      transaction_id: null,
      payment_status: "PENDING",
      mail_status: null, // mail not yet sent
      amount,
      created_date: new Date(),
    });

    // 6️⃣ Return response to frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("🚨 Razorpay Create Order Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
