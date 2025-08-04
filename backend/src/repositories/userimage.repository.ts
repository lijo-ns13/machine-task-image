import { injectable } from "inversify";
import { Types } from "mongoose";
import UserImageListModel, {
  IUserImageList,
} from "../models/userImageList.model";
import ImageModel, { IImage } from "../models/image.model";
import { IUserImageListRepository } from "../interfaces/repositories/IUserImageList.repository";

@injectable()
export class UserImageListRepository implements IUserImageListRepository {
  async addImageToUserList(userId: string, imageId: string): Promise<void> {
    await UserImageListModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $push: { imageIds: new Types.ObjectId(imageId) } },
      { upsert: true, new: true }
    );
  }

  async getImagesInOrderPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ images: IImage[]; total: number }> {
    const imageList = await UserImageListModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!imageList || imageList.imageIds.length === 0) {
      return { images: [], total: 0 };
    }

    const total = imageList.imageIds.length;
    const startIndex = (page - 1) * limit;
    const paginatedIds = imageList.imageIds.slice(
      startIndex,
      startIndex + limit
    );

    const images = await ImageModel.find({
      _id: { $in: paginatedIds },
    });

    // Maintain custom order
    const imageMap = new Map(images.map((img) => [img._id.toString(), img]));
    const ordered = paginatedIds
      .map((id) => imageMap.get(id.toString()))
      .filter(Boolean) as IImage[];

    return { images: ordered, total };
  }

  async updateImageOrder(userId: string, imageIds: string[]): Promise<void> {
    await UserImageListModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        $set: {
          imageIds: imageIds.map((id) => new Types.ObjectId(id)),
        },
      },
      { new: true, upsert: true }
    );
  }
}
