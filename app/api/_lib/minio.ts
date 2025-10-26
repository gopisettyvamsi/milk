import { Client } from "minio";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "94.784.789.548:9090";
export const MINIO_PORT = parseInt(process.env.MINIO_PORT || "9090");
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "KJ9izWx3mVredtyKnn71";
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "8A6VU6BeMCD0k8RCFW75WEmS20LcCbWEFR3KhYrTV";
export const MINIO_SECURE = process.env.MINIO_SECURE === "true";
export const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "Kagof-blogs";
export const MINIO_ENDPOINT_URL = process.env.MINIO_ENDPOINT_URL || "https://storage.edvenswatech.com/storage";

export const minioClient = new Client({
  endPoint: MINIO_ENDPOINT.split(":")[0],
  port: MINIO_PORT,
  useSSL: MINIO_SECURE,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export async function ensureBucketExists(bucketName: string) {
  const exists = await minioClient.bucketExists(bucketName).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(bucketName, "us-east-1");
  }
}

export async function uploadFileToMinio(file: File) {
  const fileExtension = path.extname(file.name || "") || ".bin";
  const objectName = `${uuidv4()}${fileExtension}`;

  await ensureBucketExists(MINIO_BUCKET_NAME);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const tmpPath = path.join(os.tmpdir(), objectName);
  fs.writeFileSync(tmpPath, buffer);

  try {
    const stream = fs.createReadStream(tmpPath);
    await minioClient.putObject(MINIO_BUCKET_NAME, objectName, stream, file.size, {
      "Content-Type": file.type || "application/octet-stream",
    });
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }

  // Public URL for your setup
  const url = `${MINIO_ENDPOINT_URL}/${MINIO_BUCKET_NAME}/${objectName}`;
  return { objectName, url };
}
