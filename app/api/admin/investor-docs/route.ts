// app/api/admin/investor-docs/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withProtection } from "@/utils/withProtection";
import { v4 as uuidv4 } from 'uuid';
import { Client } from 'minio'; // Import MinIO client
import * as fs from 'fs'; // Node.js File System module
import * as os from 'os';   // Node.js OS module
import * as path from 'path'; // Node.js Path module

// MinIO Configuration from environment variables
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "94.784.789.548:9090"; // Using provided endpoint as fallback
const MINIO_PORT = parseInt(process.env.MINIO_PORT || "9090");
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "KJ9izWx3mVredtyKnn71";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "8A6VU6BeMCD0k8RCFW75WEmS20LcCbWEFR3KhYrTV";
const MINIO_SECURE = process.env.MINIO_SECURE === 'true'; // Convert string to boolean
const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "website";
const MINIO_ENDPOINT_URL = process.env.MINIO_ENDPOINT_URL || "https://storage.edvenswatech.com/storage";

// Initialize MinIO client
const minioClient = new Client({
  endPoint: MINIO_ENDPOINT.split(':')[0], // Extract just the hostname/IP
  port: MINIO_PORT,
  useSSL: MINIO_SECURE,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

// Helper function to check if a bucket exists and create it if not
async function ensureBucketExists(bucketName: string) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1'); // You can specify a region
      console.log(`Bucket '${bucketName}' created successfully.`);
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
  } catch (err) {
    console.error(`Error ensuring bucket '${bucketName}' exists:`, err);
    throw err;
  }
}

// GET endpoint with protection
export const GET = withProtection(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  
  try {
    const countQuery = db("investor_docs").count("* as total");
    if (search) {
      countQuery
        .where("doc_title", "like", `%${search}%`);
    }
   
    const [{ total }] = await countQuery;

    // Select doc_full_url AND doc_type
    const usersQuery = db("investor_docs")
      .select("id", "doc_title", "doc_uuid", "doc_full_url", "doc_type", "created_at","web_url","action_type") // ADDED doc_type here
      .limit(limit)
      .offset((page - 1) * limit);

    if (search) {
      usersQuery
        .where("doc_title", "like", `%${search}%`);
    }
   
    const users = await usersQuery;
    console.log(users);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total: Number(total),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching investor documents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch investor documents" },
      { status: 500 }
    );
  }
});

// POST endpoint with protection
// This endpoint now handles file uploads via FormData
export const POST = withProtection(async (req: NextRequest) => {
  let tempFilePath: string | undefined; // To store the path of the temporary file

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const doc_title = formData.get("doc_title") as string; // Get title from form data
    const doc_type = formData.get("doc_type") as string;   // Get doc_type from form data (ADDED)
    const existing_id = formData.get("id") as string; // Get existing ID if available
    const action_type=formData.get("action_type") as string;
    const web_url= formData.get("web_url") as string;

    // Basic validation
    if (!doc_title) {
      return NextResponse.json({ success: false, error: "Document title is required." }, { status: 400 });
    }
    if (!doc_type) { // Validate doc_type
        return NextResponse.json({ success: false, error: "Document type is required." }, { status: 400 });
    }

    let doc_full_url: string | undefined;
    let objectName: string | undefined;

    // Only process file if a new one is uploaded (i.e., 'file' is provided)
    if (file) {
        // Generate a unique filename for MinIO
        const fileExtension = path.extname(file.name);
        objectName = `${uuidv4()}${fileExtension}`; // Unique ID for MinIO object name

        // Ensure the bucket exists
        await ensureBucketExists(MINIO_BUCKET_NAME);

        // Save the file to a temporary location
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        tempFilePath = path.join(os.tmpdir(), objectName); // Use OS temporary directory
        fs.writeFileSync(tempFilePath, buffer);
        console.log(`File saved temporarily at: ${tempFilePath}`);

        // Upload the file to MinIO
        const fileStream = fs.createReadStream(tempFilePath);
        await minioClient.putObject(MINIO_BUCKET_NAME, objectName, fileStream, file.size, {
          'Content-Type': file.type, // Set content type for MinIO
        });
        console.log(`File uploaded to MinIO: ${objectName}`);

        // Construct the full URL for the uploaded file
        doc_full_url = `${MINIO_ENDPOINT_URL}/${MINIO_BUCKET_NAME}/${objectName}`;
        console.log(`Full document URL: ${doc_full_url}`);
    } 
    // else if (!existing_id) {
    //     // If it's a new document but no file is provided, it's an error.
    //     return NextResponse.json({ success: false, error: "No file uploaded for new document." }, { status: 400 });
    // }

    const doc_uuid = uuidv4(); // Generate a new UUID for new or updated docs
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' '); // Use current timestamp

    let insertedId;
    if (existing_id) {
        // If an ID is provided, update the existing record
        const updatePayload: {
            doc_title: string;
            doc_type: string; // Ensure doc_type is always updated
            doc_uuid?: string;
            doc_full_url?: string;
            created_at?: string; // Consider 'updated_at' column for updates
            action_type?:string;
            web_url?:string
        } = {
            doc_title: doc_title,
            doc_type: doc_type, // ADDED doc_type for update
            action_type:action_type,
            web_url:web_url
        };

        // Only update URL and UUID if a new file was uploaded
        if (doc_full_url) {
            updatePayload.doc_uuid = doc_uuid;
            updatePayload.doc_full_url = doc_full_url;
            updatePayload.created_at = created_at; // Update timestamp if file changes
        }

        await db("investor_docs")
            .where({ id: existing_id })
            .update(updatePayload);
        insertedId = existing_id;
        console.log(`Updated investor document with ID: ${insertedId}`);
    } else {
        // Otherwise, insert a new record
        const [id] = await db("investor_docs").insert({
            doc_title: doc_title,
            doc_type: doc_type, // ADDED doc_type for insert
            doc_uuid: doc_uuid,
            doc_full_url: doc_full_url,
            created_at: created_at,
            action_type:action_type,
            web_url:web_url,

        });
        insertedId = id;
        console.log(`Created new investor document with ID: ${insertedId}`);
    }

    return NextResponse.json({
      success: true,
      message: existing_id ? "Document updated successfully" : "Document created successfully",
      docId: insertedId,
      doc_full_url: doc_full_url, // Return the URL
    });

  } catch (error) {
    console.error("Error during file upload or database operation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file or create/update document" },
      { status: 500 }
    );
  } finally {
    // Clean up the temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log(`Temporary file deleted: ${tempFilePath}`);
    }
  }
});

// PUT endpoint with protection (used for updating doc_title AND doc_type if file doesn't change)
export const PUT = withProtection(async (req: NextRequest) => {
  try {
    const userData = await req.json();


    console.log(userData);
    // Destructure doc_type along with id and doc_title
    const { id, doc_title, doc_type,web_url,action_type } = userData; 

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required for update." }, { status: 400 });
    }

    const updatePayload: { doc_title?: string; doc_type?: string,web_url?:string,action_type?:string } = {}; // Include doc_type in payload type
    if (doc_title !== undefined) {
      updatePayload.doc_title = doc_title;
    }
    if (doc_type !== undefined) { // Check if doc_type is provided
        updatePayload.doc_type = doc_type; // ADDED doc_type to update payload
    }

        if (web_url !== undefined) { // Check if doc_type is provided
        updatePayload.web_url = web_url; // ADDED doc_type to update payload
    }

        if (doc_type !== undefined) { // Check if doc_type is provided
        updatePayload.action_type = action_type; // ADDED doc_type to update payload
    }



    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ success: false, message: "No updatable fields provided." }, { status: 400 });
    }

    await db("investor_docs").where({ id }).update(updatePayload);

    return NextResponse.json({
      success: true,
      message: "Investor document updated successfully",
    });
  } catch (error) {
    console.error("Error updating investor document:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update investor document" },
      { status: 500 }
    );
  }
});

// DELETE endpoint with protection - remains unchanged
export const DELETE = withProtection(async (req: NextRequest) => {
  try {
    const { id } = await req.json();
    
    // Optional: Before deleting the record, you might want to delete the file from MinIO
    // if it's no longer needed. This would require fetching the doc_full_url first.
    // Example:
    // const doc = await db("investor_docs").where({ id }).first();
    // if (doc && doc.doc_full_url) {
    //   const objectName = doc.doc_full_url.split('/').pop();
    //   if (objectName) {
    //     await minioClient.removeObject(MINIO_BUCKET_NAME, objectName);
    //     console.log(`Deleted MinIO object: ${objectName}`);
    //   }
    // }

    await db("investor_docs").where({ id }).delete();

    return NextResponse.json({
      success: true,
      message: "Investor document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting investor document:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete investor document" },
      { status: 500 }
    );
  }
});

