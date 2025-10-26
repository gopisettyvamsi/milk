import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
// import { getServerSession } from "next-auth"; // If using next-auth

export async function GET(req: NextRequest) {
  try {
    // Example: if you’re using NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userEmail = session.user.email;

    // For demo, assume query param "email" is passed (replace with session in production)
    const searchParams = req.nextUrl.searchParams;
   // const userEmail = searchParams.get("email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Step 1: Find user by email
    const user = await db("users").where("email", userEmail).first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 2: Query payments for that user_id
    const payments = await db("payment_history")
      .join("events_data", "payment_history.event_id", "events_data.id")
      .select(
        "payment_history.payment_id as id",
        "payment_history.order_id",
        "payment_history.transaction_id",
        "payment_history.payment_status as status",
        "payment_history.amount as amountPaid",
        "payment_history.created_date",
        "events_data.event_title as enrolledEvent",
        "events_data.slug as eventId"
      )
      .where("payment_history.user_id", user.id)
      .orderBy("payment_history.created_date", "desc");

    // Step 3: Format response
    const formattedPayments = payments.map((payment, index) => ({
      id: payment.id,
      sno: index + 1,
      eventId: payment.eventId,
      enrolledEvent: payment.enrolledEvent,
      amountPaid: parseFloat(payment.amountPaid),
      status: payment.status,
      transactionId: payment.transaction_id,
      orderId: payment.order_id,
      createdDate: payment.created_date,
    }));

    return NextResponse.json(formattedPayments);
  } catch (error: any) {
    console.error("Payment History API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
