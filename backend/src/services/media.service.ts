import { inject, injectable } from "inversify";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { IMediaService } from "../interfaces/services/IMediaService";

export interface MediaUrlDTO {
  url: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

@injectable()
export class MediaService implements IMediaService {
  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  async uploadSingleMedia(file: Express.Multer.File): Promise<string> {
    this.validateFile(file);

    const fileKey = `media/${uuidv4()}-${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "private",
      })
    );

    return fileKey;
  }

  async uploadMedia(files: Express.Multer.File[]): Promise<string[]> {
    return await Promise.all(
      files.map(async (file) => this.uploadSingleMedia(file))
    );
  }

  async getMediaUrl(s3Key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: s3Key,
      });

      return await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (error) {
      throw new Error(`Failed to generate signed URL for ${s3Key}`);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(
        `File too large: ${file.originalname} (max ${
          this.MAX_FILE_SIZE / 1024 / 1024
        }MB)`
      );
    }
  }
}
