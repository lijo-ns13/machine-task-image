import { CreateImageInput } from "../../dtos/image.schema";
import { IImage } from "../../models/image.model";

export interface IImageRepository {
  findByTitles(titles: string[], userId: string): Promise<IImage[]>;
  createImages(data: CreateImageInput[]): Promise<IImage[]>;
  createImage(data: CreateImageInput): Promise<IImage>;
  updateImage(imageId: string, data: { title: string }): Promise<IImage>;
  getImageById(imageId: string): Promise<IImage | null>;
  deleteImage(imageId: string): Promise<void>;
  findByTitle(title: string, userId: string): Promise<boolean>;
  findByTitleExceptId(
    title: string,
    userId: string,
    excludeImageId: string
  ): Promise<boolean>;
}
