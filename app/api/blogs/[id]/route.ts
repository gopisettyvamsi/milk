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
const MINIO_BUCKET_NAME =  process.env.MINIO_BUCKET_NAME || "Kagof-blogs";
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
    { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
    try {
        const { id } = await params; // Await the params Promise

        const blog = await db('blogs_data')
            .select('id', 'blog_title','slug', 'blog_content', 'blog_image', 'blog_cateogry', 'created_at')
            .where('id', id)
            .first();

        if (!blog) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
}

// DELETE - Delete blog post by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
    try {
        const { id } = await params; // Await the params Promise

        // Check if blog exists
        const existingBlog = await db('blogs_data').where('id', id).first();
        if (!existingBlog) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        // Delete the blog post
        await db('blogs_data').where('id', id).del();

        return NextResponse.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let tempFilePath: string | undefined;

  try {
    const { id } = await params;
    const existingBlog = await db('blogs_data').where('id', id).first();

    const formData = await request.formData();
    const blog_title = formData.get('blog_title') as string;
    const slug=formData.get('slug') as string;
    const blog_content = formData.get('blog_content') as string;
    const blog_cateogry = formData.get('blog_cateogry') as string;
    const existing_image_path = formData.get('existing_image_path') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!blog_title || !blog_content || !blog_cateogry) {
      return NextResponse.json(
        { error: 'Missing required fields: blog_title, blog_content, and blog_cateogry are required' },
        { status: 400 }
      );
    }
    console.log(imageFile);
    
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

    const blogData = {
      blog_title: blog_title.trim(),
      slug:slug.trim(),
      blog_content: blog_content.trim(),
      blog_image: imagePath,
      blog_cateogry: blog_cateogry.trim(),
    };

    if (existingBlog) {
      await db('blogs_data').where('id', id).update(blogData);
      const updatedBlog = await db('blogs_data').where('id', id).first();
      return NextResponse.json(updatedBlog);
    } else {
      const [insertedId] = await db('blogs_data').insert({
        ...blogData,
        created_at: new Date().toISOString().split('T')[0],
      }).returning('id');
      const newBlog = await db('blogs_data').where('id', insertedId.id || insertedId).first();
      return NextResponse.json(newBlog, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log(`Temporary file deleted: ${tempFilePath}`);
    }
  }
}