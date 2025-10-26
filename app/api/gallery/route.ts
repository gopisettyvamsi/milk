import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { uploadFileToMinio } from "../_lib/minio";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// GET /api/gallery  -> list galleries with photo_count
export async function GET() {
  try {
    const rows = await db("galleries")
      .select("id", "title", "slug", "thumbnail_url", "photo_count", "created_at").orderBy("id", "desc");
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch galleries" }, { status: 500 });
  }
}

// POST /api/gallery  (multipart/form-data)
// fields: title (required), slug? (optional), thumbnail? (File)
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = (form.get("title") as string)?.trim();
    const customSlug = (form.get("slug") as string)?.trim();
    const thumbnail = form.get("thumbnail") as File | null;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = customSlug || slugify(title);
    let thumbnail_url: string | null = null;

    if (thumbnail && thumbnail.size > 0) {
      const { url } = await uploadFileToMinio(thumbnail);
      thumbnail_url = url;
    }

    const [id] = await db("galleries").insert({
      title,
      slug,
      thumbnail_url,
      photo_count: 0,
    });

    const created = await db("galleries").where({ id }).first();
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create gallery" }, { status: 500 });
  }
}
