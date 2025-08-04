import { CreateImageInput, ImageDTO } from "../../dtos/image.schema";

export interface IImageService {
  createImage(data: CreateImageInput): Promise<ImageDTO>;
}
