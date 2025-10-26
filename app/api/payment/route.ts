import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency } = body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    
    const options = {
      amount: amount * 100, 
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
