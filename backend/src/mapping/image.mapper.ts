import { ImageDTO } from "../dtos/image.schema";
import { IImage } from "../models/image.model";
import { IMediaService } from "../interfaces/services/IMediaService";

export class ImageMapper {
  static async toDTO(image: IImage, mediaService: IMediaService): Promise<ImageDTO> {
    const signedUrl = await mediaService.getMediaUrl(image.s3key);

    return {
      id: image._id.toHexString(),
      title: image.title,
      userId: image.userId.toHexString(),
      s3key: signedUrl, // now contains signed URL
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }
}
