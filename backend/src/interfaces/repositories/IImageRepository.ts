import { CreateImageInput } from "../../dtos/image.schema";
import { IImage } from "../../models/image.model";

export interface IImageRepository {
  createImage(data: CreateImageInput): Promise<IImage>;
  updateImage(imageId: string, data: { title: string }): Promise<IImage>;
  getImageById(imageId: string): Promise<IImage | null>;
  deleteImage(imageId: string): Promise<void>;
  findByTitle(title: string): Promise<boolean>;
}
