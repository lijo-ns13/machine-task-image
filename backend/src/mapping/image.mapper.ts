import { ImageDTO } from "../dtos/image.schema";
import { IImage } from "../models/image.model";

export class ImageMapper {
  static toDTO(image: IImage): ImageDTO {
    return {
      id: image._id.toHexString(),
      title: image.title,
      userId: image.userId.toHexString(),
      s3key: image.s3key,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }
}
