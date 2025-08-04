export interface IMediaService {
  uploadSingleMedia(file: Express.Multer.File): Promise<string>;
  uploadMedia(files: Express.Multer.File[]): Promise<string[]>;
  getMediaUrl(s3Key: string): Promise<string>;
}
