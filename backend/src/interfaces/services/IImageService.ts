import { CreateImageInput, ImageDTO } from "../../dtos/image.schema";

export interface IImageService {
  createImages(data: CreateImageInput[]): Promise<ImageDTO[]>;
  checkDuplicateTitles(titles: string[], userId: string): Promise<string[]>;
  createImage(data: CreateImageInput): Promise<ImageDTO>;
  getImagesInUserOrderPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ images: ImageDTO[]; total: number }>;
  updateImageOrder(userId: string, imageIds: string[]): Promise<void>;
  updateImage(
    imageId: string,
    data: { title: string },
    userId: string
  ): Promise<ImageDTO>;
  deleteImage(imageId: string): Promise<void>;
}
