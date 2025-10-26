//app\api\payments\receipt\[transaction_id]\route.ts

import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";

// GET - Fetch payment receipt details by transaction_id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transaction_id: string }> }
) {
  try {
    const { transaction_id } = await params;

    const payment = await db("payment_history")
      .where({ transaction_id })
      .first();

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Receipt not found" },
        { status: 404 }
      );
    }

    const user = await db("users")
      .where({ id: payment.user_id })
      .select("name", "email", "phone_number")
      .first();

    const event = await db("events_data")
      .where({ id: payment.event_id })
      .select("event_title")
      .first();

    return NextResponse.json({
      success: true,
      data: {
        ...payment,
        user_name: user?.name || "Unknown User",
        user_email: user?.email || "",
        user_phone: user?.phone_number || "",
        event_title: event?.event_title || "",
        payment_date: new Date(payment.created_date).toLocaleString("en-IN"),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching receipt:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch receipt" },
      { status: 500 }
    );
  }
}
