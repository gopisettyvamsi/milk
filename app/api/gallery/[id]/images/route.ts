import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/gallery/:id/images
export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params

    const photos = await db("gallery_photos")
      .select("id", "gallery_id", "image_url", "caption", "created_at")
      .where({ gallery_id: id })
      .orderBy("id", "desc");

    return NextResponse.json(photos);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
