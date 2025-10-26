import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const event_id = searchParams.get("event_id");
  if (!event_id) return NextResponse.json([], { status: 200 });

  const prices = await db("event_category_prices").where({ event_id });
  return NextResponse.json(prices);
}

export async function POST(req) {
  const body = await req.json();
  const { event_id, prices } = body;
  if (!event_id) return NextResponse.json({ error: "Missing event_id" }, { status: 400 });

  for (const p of prices) {
    const existing = await db("event_category_prices")
      .where({ event_id, category_id: p.category_id })
      .first();
    if (existing) {
      await db("event_category_prices")
        .where({ id: existing.id })
        .update({
          price: p.price,
          earlybird_registration_price: p.earlybird_registration_price,
          spot_registration_price: p.spot_registration_price,
          category_name: p.category_name,
        });
    } else {
      await db("event_category_prices").insert({
        event_id,
        category_id: p.category_id,
        category_name: p.category_name,
        price: p.price,
        earlybird_registration_price: p.earlybird_registration_price,
        spot_registration_price: p.spot_registration_price,
      });
    }
  }

  return NextResponse.json({ success: true });
}
