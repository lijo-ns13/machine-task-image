import { IImage } from "../../models/image.model";

export interface IUserImageListRepository {
  getImagesInOrderPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ images: IImage[]; total: number }>;
  addImageToUserList(userId: string, imageId: string): Promise<void>;
  // getImagesInOrder(userId: string): Promise<IImage[]>;
  updateImageOrder(userId: string, imageIds: string[]): Promise<void>;
}
