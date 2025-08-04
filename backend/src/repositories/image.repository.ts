import { injectable } from "inversify";
import { CreateImageInput } from "../dtos/image.schema";
import ImageModel, { IImage } from "../models/image.model";
import UserImageList from "../models/userImageList.model";
import { IImageRepository } from "../interfaces/repositories/IImageRepository";

@injectable()
export class ImageRepository implements IImageRepository {
  async createImage(data: CreateImageInput): Promise<IImage> {
    const image = await ImageModel.create(data);

    await UserImageList.findOneAndUpdate(
      { userId: data.userId },
      { $addToSet: { imageIds: image._id } },
      { upsert: true, new: true }
    );

    return image;
  }
}
