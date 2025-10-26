import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // ✅ Step 1: Count successful payments grouped by event_id
    const data = await db("payment_history")
      .select("event_id")
      .count("* as total_users")
      .where("payment_status", "SUCCESS")
      .groupBy("event_id");

    // ✅ Step 2: Fetch event titles for mapping
    const events = await db("events_data").select("id", "event_title");

    // ✅ Step 3: Merge event names with user counts
    const result = data.map((item: any) => {
      const event = events.find((e: any) => e.id === item.event_id);
      return {
        name: event ? event.event_title : `Event ${item.event_id}`,
        value: Number(item.total_users),
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error fetching enrollment stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event enrollment stats" },
      { status: 500 }
    );
  }
}
