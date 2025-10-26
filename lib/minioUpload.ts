// lib/minioUpload.ts
import { Client } from 'minio';
import path from 'path';
import fs from 'fs/promises';

// Define types for better TypeScript support
interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

interface UploadResult {
  success: boolean;
  message: string;
  objectName?: string;
  etag?: string;
}

/**
 * Creates a configured MinIO client
 * @param config - MinIO configuration parameters
 * @returns MinIO Client instance
 */
export const createMinioClient = (config: MinioConfig): Client => {
  return new Client({
    endPoint: config.endPoint,
    port: config.port,
    useSSL: config.useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  });
};


export const minioConfig = {
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT || '9090'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  };
  
  
  

/**
 * Default MinIO client instance
 * Override these values with environment variables in your Next.js application
 */
export const defaultMinioClient = createMinioClient({
  endPoint: process.env.MINIO_ENDPOINT || '54.213.113.129',
  port: parseInt(process.env.MINIO_PORT || '9090'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'OBMlz0VKWJqY2BjrKlsS',
  secretKey: process.env.MINIO_SECRET_KEY || 'bTFNy3eEl3zuPHsfQzemDBccxw8NJ822KD0PnSwQ',
});

/**
 * Upload a file to MinIO bucket from file path
 * @param filePath - Path to the file to upload
 * @param bucketName - Name of the bucket
 * @param objectName - Optional custom name for the file in the bucket
 * @param client - Optional custom MinIO client instance
 * @returns Promise resolving to upload result
 */
export async function uploadFileToMinio(
  filePath: string,
  bucketName: string,
  objectName?: string | null,
  client: Client = defaultMinioClient
): Promise<UploadResult> {
  try {
    // Ensure file exists
    await fs.access(filePath);
    
    // If objectName is not provided, use the original filename
    const finalObjectName = objectName || path.basename(filePath);
    
    // Check if bucket exists, if not create it
    const bucketExists = await client.bucketExists(bucketName);
    if (!bucketExists) {
      await client.makeBucket(bucketName);
      console.log(`Bucket '${bucketName}' created successfully`);
    }
    
    // Upload the file
    const result = await client.fPutObject(bucketName, finalObjectName, filePath);
    
    return {
      success: true,
      message: `Successfully uploaded ${filePath} to ${bucketName}/${finalObjectName}`,
      objectName: finalObjectName,
      etag: result.etag
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Upload a Buffer to MinIO bucket
 * @param buffer - Buffer containing the file data
 * @param bucketName - Name of the bucket
 * @param objectName - Name for the file in the bucket
 * @param client - Optional custom MinIO client instance
 * @returns Promise resolving to upload result
 */
export async function uploadBufferToMinio(
  buffer: Buffer,
  bucketName: string,
  objectName: string,
  client: Client = defaultMinioClient
): Promise<UploadResult> {
  try {
    // Check if bucket exists, if not create it
    const bucketExists = await client.bucketExists(bucketName);
    if (!bucketExists) {
      await client.makeBucket(bucketName);
      console.log(`Bucket '${bucketName}' created successfully`);
    }
    
    // Upload the buffer
    const result = await client.putObject(bucketName, objectName, buffer);
    
    return {
      success: true,
      message: `Successfully uploaded buffer to ${bucketName}/${objectName}`,
      objectName,
      etag: result.etag
    };
  } catch (error) {
    console.error('Error uploading buffer:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get a temporary URL for accessing an object
 * @param bucketName - Name of the bucket
 * @param objectName - Name of the object
 * @param expiry - Expiry time in seconds (default: 24 hours)
 * @param client - Optional custom MinIO client instance
 * @returns Promise resolving to the presigned URL
 */
export async function getPresignedUrl(
  bucketName: string,
  objectName: string,
  expiry: number = 24 * 60 * 60,
  client: Client = defaultMinioClient
): Promise<string> {
  return client.presignedGetObject(bucketName, objectName, expiry);
}