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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const event = await db('events_data')
            .select('id', 'event_title', 'event_description', 'event_image', 'event_location',  'event_category',  'created_at', 'event_start_date',
              'event_end_date', 'event_start_time', 'event_end_time','slug', 'event_price', 'earlybird_registration_date')
            .where('id', id)
            .first();

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }
}

// DELETE - Delete event by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check if event exists
        const existingEvent = await db('events_data').where('id', id).first();
        if (!existingEvent) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Delete the event
        await db('events_data').where('id', id).del();

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}


function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') 
    .replace(/^-+|-+$/g, '');
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let tempFilePath: string | undefined;

  try {
    const { id } = await params;
    const existingEvent = await db('events_data').where('id', id).first();

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const event_title = formData.get('event_title') as string;
    const event_description = formData.get('event_description') as string;
    const event_location = formData.get('event_location') as string;
    const event_price = formData.get('event_price') as string;
    const slug = formData.get('slug') as string;
    const event_start_date = formData.get('event_start_date') as string;
    const event_end_date = formData.get('event_end_date') as string;
    const event_start_time = formData.get('event_start_time') as string;
    const event_end_time = formData.get('event_end_time') as string;
    const event_category = formData.get('event_category') as string;
    const earlybird_registration_date = formData.get('earlybird_registration_date') as string;
    const existing_image_path = formData.get('existing_image_path') as string | null;
    const imageFile = formData.get('image') as File | null;

    let imagePath = existing_image_path || '';
    let objectName: string | undefined;

    if (imageFile && imageFile.size > 0) {
      const fileExtension = path.extname(imageFile.name);
      objectName = `${uuidv4()}${fileExtension}`;

      await ensureBucketExists(MINIO_BUCKET_NAME);

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      tempFilePath = path.join(os.tmpdir(), objectName);
      fs.writeFileSync(tempFilePath, buffer);

      const fileStream = fs.createReadStream(tempFilePath);
      await minioClient.putObject(MINIO_BUCKET_NAME, objectName, fileStream, imageFile.size, {
        'Content-Type': imageFile.type,
      });

      imagePath = `${MINIO_ENDPOINT_URL}/${MINIO_BUCKET_NAME}/${objectName}`;
    }

    // Improved normalization function that handles empty strings and "null" values properly
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

    // Special handling for event_price - convert to number or set to 0 if empty
    const processEventPrice = (price: any): number | null => {
      if (price === undefined || price === null) return 0; // Default to 0 instead of null
      if (typeof price === "string") {
        const trimmed = price.trim();
        if (trimmed === "" || trimmed.toLowerCase() === "null") return 0;
        const num = parseFloat(trimmed);
        return isNaN(num) ? 0 : num;
      }
      if (typeof price === "number") return price;
      return 0;
    };

    const eventData = {
      event_title: normalizeField(event_title, false) || '', // Ensure not null
      event_description: normalizeField(event_description, false) || '',
      event_image: imagePath,
      event_location: normalizeField(event_location, false) || '',
      event_start_date: event_start_date || null,
      event_end_date: event_end_date || null,
      event_start_time: normalizeField(event_start_time),
      event_end_time: normalizeField(event_end_time),
      event_category: normalizeField(event_category, false) || '',
      event_price: processEventPrice(event_price), // This will never be null
      earlybird_registration_date: earlybird_registration_date || null,
      slug: slug || generateSlug(event_title),
    };

    await db('events_data').where('id', id).update(eventData);
    const updatedEvent = await db('events_data').where('id', id).first();
    
    return NextResponse.json(updatedEvent);

  } catch (error) {
    console.error('Error saving event:', error);
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log(`Temporary file deleted: ${tempFilePath}`);
    }
  }
}
