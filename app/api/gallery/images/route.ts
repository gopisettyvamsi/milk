import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { uploadFileToMinio } from "../../_lib/minio";

// POST /api/gallery/images   (multipart/form-data)
// fields: gallery_id (required), caption? (string), images (File | File[])
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const gallery_id = Number(form.get("gallery_id"));
    if (!gallery_id) {
      return NextResponse.json({ error: "gallery_id is required" }, { status: 400 });
    }

    const exists = await db("galleries").where({ id: gallery_id }).first();
    if (!exists) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // images could be single File or multiple Files
    const files = form.getAll("images").filter(Boolean) as File[];
    const caption = (form.get("caption") as string) || null;

    if (!files.length) {
      return NextResponse.json({ error: "No images uploaded" }, { status: 400 });
    }

    const rowsToInsert: Array<{ gallery_id: number; image_url: string; caption: string | null }> = [];

    for (const f of files) {
      if (!(f instanceof File) || f.size <= 0) continue;
      const { url } = await uploadFileToMinio(f);
      rowsToInsert.push({ gallery_id, image_url: url, caption });
    }

    if (!rowsToInsert.length) {
      return NextResponse.json({ error: "No valid images" }, { status: 400 });
    }

    await db("gallery_photos").insert(rowsToInsert);
    await db("galleries").where({ id: gallery_id }).increment("photo_count", rowsToInsert.length);

    const photos = await db("gallery_photos")
      .select("id", "gallery_id", "image_url", "caption", "created_at")
      .where({ gallery_id })
      .orderBy("id", "desc");

    return NextResponse.json({ success: true, photos }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to upload photos" }, { status: 500 });
  }
}
