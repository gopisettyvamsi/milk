import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// PUT /api/gallery/images/:photoId
export async function PUT(req: NextRequest, context: { params: Promise<{ photoId: string }> }) {
  try {
    const { photoId } = await context.params; // ✅ await params
    const photo = await db("gallery_photos").where({ id: photoId }).first();
    if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 });

    const payload = await req.json().catch(() => ({}));
    const caption = typeof payload.caption === "string" ? payload.caption.trim() : photo.caption;

    await db("gallery_photos").where({ id: photoId }).update({ caption });
    const updated = await db("gallery_photos").where({ id: photoId }).first();
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

// DELETE /api/gallery/images/:photoId
export async function DELETE(_: NextRequest, context: { params: Promise<{ photoId: string }> }) {
  try {
    const { photoId } = await context.params; // ✅ await params

    const photo = await db("gallery_photos").where({ id: photoId }).first();
    if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 });

    await db.transaction(async (trx: any) => {
      await trx("gallery_photos").where({ id: photoId }).del();
      await trx("galleries").where({ id: photo.gallery_id }).decrement("photo_count", 1);
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
