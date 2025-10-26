import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { uploadFileToMinio } from "../../_lib/minio";

// ✅ GET /api/gallery/:id
export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params

    const gallery = await db("galleries").where({ id }).first().orderBy("id", "desc");
    if (!gallery) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(gallery);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// ✅ PUT /api/gallery/:id (multipart/form-data)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params

    const existing = await db("galleries").where({ id }).first();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const form = await req.formData();
    const title = (form.get("title") as string) ?? existing.title;
    const slug = (form.get("slug") as string) ?? existing.slug;
    const thumbnail = form.get("thumbnail") as File | null;

    let thumbnail_url = existing.thumbnail_url;
    if (thumbnail && thumbnail.size > 0) {
      const { url } = await uploadFileToMinio(thumbnail);
      thumbnail_url = url;
    }

    await db("galleries")
      .where({ id })
      .update({ title, slug, thumbnail_url });

    const updated = await db("galleries").where({ id }).first();
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 });
  }
}

// ✅ DELETE /api/gallery/:id
export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params

    const exists = await db("galleries").where({ id }).first();
    if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Cascade delete handled by FK on gallery_photos
    await db("galleries").where({ id }).del();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete gallery" }, { status: 500 });
  }
}
