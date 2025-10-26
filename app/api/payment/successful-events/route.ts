import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth"; // Import your NextAuth auth options

export async function GET(req: NextRequest) {
  try {
    // Step 1: Retrieve the session using NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Step 2: Find the user by email to get the user_id
    const user = await db("users").where("email", userEmail).first();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user_id = user.id;

    // Step 3: Query the payment_history table for successful payments and count them by event_id
    const result = await db("payment_history")
      .select("event_id")
      .count("* as successfulEvents")
      .where("user_id", user_id)
      .andWhere("payment_status", "SUCCESS")
      .groupBy("event_id");

    // Step 4: Format the result to return the successful events count for each event_id
    const successfulEvents = result.map((row) => ({
      event_id: row.event_id,
      successfulEvents: row.successfulEvents,
    }));

    // Step 5: Return the count of successful events for each event_id
    return NextResponse.json({ successfulEvents });
  } catch (error: any) {
    console.error("Error fetching successful events:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
