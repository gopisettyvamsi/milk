import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// MinIO Configuration
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "94.784.789.548:9090";
const MINIO_PORT = parseInt(process.env.MINIO_PORT || "9090");
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "KJ9izWx3mVredtyKnn71";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "8A6VU6BeMCD0k8RCFW75WEmS20LcCbWEFR3KhYrTV";
const MINIO_SECURE = process.env.MINIO_SECURE === 'true';
const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "Kagof-blogs";
const MINIO_ENDPOINT_URL = process.env.MINIO_ENDPOINT_URL || "https://storage.edvenswatech.com/storage";

// Initialize MinIO client
const minioClient = new Client({
  endPoint: MINIO_ENDPOINT.split(':')[0],
  port: MINIO_PORT,
  useSSL: MINIO_SECURE,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

// Helper function to ensure bucket exists
async function ensureBucketExists(bucketName: string) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket '${bucketName}' created successfully.`);
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
  } catch (err) {
    console.error(`Error ensuring bucket '${bucketName}' exists:`, err);
    throw err;
  }
}

// Helper function to normalize fields
const normalizeField = (val: any, allowNull: boolean = true) => {
  if (val === undefined || val === null) return allowNull ? null : '';
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "" || trimmed.toLowerCase() === "null") {
      return allowNull ? null : '';
    }
    return trimmed;
  }
  return val;
};

// ✅ Helper function to format date for MySQL
const formatDateForMySQL = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  
  try {
    // Handle ISO format (2025-10-07T18:30:00.000Z)
    const dateObj = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn(`Invalid date provided: ${dateString}`);
      return null;
    }
    
    // Format as YYYY-MM-DD HH:MM:SS for MySQL DATETIME
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return null;
  }
};

// ============ GET - Fetch magazines ============
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const eventId = searchParams.get('eventId');

    if (id) {
      // Get single magazine
      const magazine = await db('magazines')
        .select('id', 'event_id', 'title', 'author', 'file_url', 'brochure_url', 'publish_date', 'is_published', 'created_at', 'updated_at')
        .where('id', id)
        .first();

      if (!magazine) {
        return NextResponse.json({ success: false, error: 'Magazine not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: magazine });
    }

    if (eventId) {
      // Get all magazines for an event
      const magazines = await db('magazines')
        .select('id', 'event_id', 'title', 'author', 'file_url', 'brochure_url', 'publish_date', 'is_published', 'created_at', 'updated_at')
        .where('event_id', eventId)
        .orderBy('created_at', 'desc');

      return NextResponse.json({ success: true, data: magazines });
    }

    return NextResponse.json({ success: false, error: 'Missing id or eventId parameter' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching magazines:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch magazines' }, { status: 500 });
  }
}

// ============ POST - Create magazine ============
export async function POST(request: NextRequest) {
  let tempFiles: string[] = [];

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const publishDate = formData.get("publish_date") as string;
    const isPublished = formData.get("is_published") === "true" ? 1 : 0;
    const eventId = formData.get("event_id") as string;
    const magazineFile = formData.get("magazine_file") as File | null;
    const brochureFile = formData.get("brochure_file") as File | null;

    // ✅ Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    // ✅ Require at least one file
    if ((!magazineFile || magazineFile.size === 0) &&
        (!brochureFile || brochureFile.size === 0)) {
      return NextResponse.json(
        { success: false, error: "At least one file (magazine or brochure) must be uploaded" },
        { status: 400 }
      );
    }

    await ensureBucketExists(MINIO_BUCKET_NAME);

    let fileUrl: string | null = null;
    let brochureUrl: string | null = null;

    // ✅ Upload magazine file (if provided)
    if (magazineFile && magazineFile.size > 0) {
      const fileExtension = path.extname(magazineFile.name);
      const objectName = `magazines/${uuidv4()}${fileExtension}`;

      const bytes = await magazineFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempDir = path.join(os.tmpdir(), "magazines");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const tempFilePath = path.join(tempDir, `${uuidv4()}${fileExtension}`);
      fs.writeFileSync(tempFilePath, buffer);
      tempFiles.push(tempFilePath);

      const fileStream = fs.createReadStream(tempFilePath);
      await minioClient.putObject(
        MINIO_BUCKET_NAME,
        objectName,
        fileStream,
        magazineFile.size,
        { "Content-Type": magazineFile.type }
      );

      fileUrl = `${MINIO_ENDPOINT_URL}/${MINIO_BUCKET_NAME}/${objectName}`;
    }

    // ✅ Upload brochure file (if provided)
    if (brochureFile && brochureFile.size > 0) {
      const fileExtension = path.extname(brochureFile.name);
      const objectName = `magazines/brochures/${uuidv4()}${fileExtension}`;

      const bytes = await brochureFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempDir = path.join(os.tmpdir(), "magazines", "brochures");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const tempFilePath = path.join(tempDir, `${uuidv4()}${fileExtension}`);
      fs.writeFileSync(tempFilePath, buffer);
      tempFiles.push(tempFilePath);

      const fileStream = fs.createReadStream(tempFilePath);
      await minioClient.putObject(
        MINIO_BUCKET_NAME,
        objectName,
        fileStream,
        brochureFile.size,
        { "Content-Type": brochureFile.type }
      );

      brochureUrl = `${MINIO_ENDPOINT_URL}/${MINIO_BUCKET_NAME}/${objectName}`;
    }

    // ✅ Format date for MySQL
    const formattedDate = formatDateForMySQL(publishDate);

    // ✅ Insert into DB (allow nulls)
    const magazineData = {
      event_id: parseInt(eventId),
      title: normalizeField(title, false) || "",
      author: normalizeField(author, false) || "",
      file_url: fileUrl || null,
      brochure_url: brochureUrl || null,
      publish_date: formattedDate,
      is_published: isPublished,
    };

    const result = await db("magazines").insert(magazineData);
    const newMagazine = await db("magazines").where("id", result[0]).first();

    return NextResponse.json({ success: true, data: newMagazine }, { status: 201 });
  } catch (error) {
    console.error("Error creating magazine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create magazine" },
      { status: 500 }
    );
  } finally {
    // 🧹 Clean up temp files
    tempFiles.forEach((filePath) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  }
}


// ============ PUT - Update magazine ============
export async function PUT(request: NextRequest) {
  let tempFiles: string[] = [];

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Magazine ID is required' }, { status: 400 });
    }

    // Check if magazine exists
    const existingMagazine = await db('magazines').where('id', id).first();
    if (!existingMagazine) {
      return NextResponse.json({ success: false, error: 'Magazine not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const publishDate = formData.get('publish_date') as string;
    const isPublished = formData.get('is_published') === 'true' ? 1 : 0;
    const magazineFile = formData.get('magazine_file') as File | null;
    const brochureFile = formData.get('brochure_file') as File | null;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    await ensureBucketExists(MINIO_BUCKET_NAME);

    let fileUrl = existingMagazine.file_url;
    let brochureUrl = existingMagazine.brochure_url;

    // Upload new magazine file if provided
    if (magazineFile && magazineFile.size > 0) {
      const fileExtension = path.extname(magazineFile.name);
      const objectName = `magazines/${uuidv4()}${fileExtension}`;

      const bytes = await magazineFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempDir = path.join(os.tmpdir(), 'magazines');
      
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const tempFilePath = path.join(tempDir, `${uuidv4()}${fileExtension}`);
      fs.writeFileSync(tempFilePath, buffer);
      tempFiles.push(tempFilePath);

      const fileStream = fs.createReadStream(tempFilePath);
      await minioClient.putObject(MINIO_BUCKET_NAME, objectName, fileStream, magazineFile.size, {
        'Content-Type': magazineFile.type,
      });

      fileUrl = `${MINIO_ENDPOINT_URL}/${MINIO_BUCKET_NAME}/${objectName}`;
    }

    // Upload new brochure file if provided
    if (brochureFile && brochureFile.size > 0) {
      const fileExtension = path.extname(brochureFile.name);
      const objectName = `magazines/brochures/${uuidv4()}${fileExtension}`;

      const bytes = await brochureFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempDir = path.join(os.tmpdir(), 'magazines', 'brochures');
      
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const tempFilePath = path.join(tempDir, `${uuidv4()}${fileExtension}`);
      fs.writeFileSync(tempFilePath, buffer);
      tempFiles.push(tempFilePath);

      const fileStream = fs.createReadStream(tempFilePath);
      await minioClient.putObject(MINIO_BUCKET_NAME, objectName, fileStream, brochureFile.size, {
        'Content-Type': brochureFile.type,
      });

      brochureUrl = `${MINIO_ENDPOINT_URL}/${MINIO_BUCKET_NAME}/${objectName}`;
    }

    // ✅ Format date before updating
    const formattedDate = formatDateForMySQL(publishDate);

    const magazineData = {
      title: normalizeField(title, false) || '',
      author: normalizeField(author, false) || '',
      file_url: fileUrl,
      brochure_url: brochureUrl || null,
      publish_date: formattedDate,
      is_published: isPublished,
      updated_at: new Date(),
    };

    await db('magazines').where('id', id).update(magazineData);
    const updatedMagazine = await db('magazines').where('id', id).first();

    return NextResponse.json({ success: true, data: updatedMagazine });
  } catch (error) {
    console.error('Error updating magazine:', error);
    return NextResponse.json({ success: false, error: 'Failed to update magazine' }, { status: 500 });
  } finally {
    // Clean up temp files
    tempFiles.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
}

// ============ DELETE - Delete magazine ============
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Magazine ID is required' }, { status: 400 });
    }

    // Check if magazine exists
    const existingMagazine = await db('magazines').where('id', id).first();
    if (!existingMagazine) {
      return NextResponse.json({ success: false, error: 'Magazine not found' }, { status: 404 });
    }

    // Delete from database
    await db('magazines').where('id', id).del();

    return NextResponse.json({ success: true, message: 'Magazine deleted successfully' });
  } catch (error) {
    console.error('Error deleting magazine:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete magazine' }, { status: 500 });
  }
}