import { injectable } from "inversify";
import { CreateImageInput } from "../dtos/image.schema";
import ImageModel, { IImage } from "../models/image.model";
import UserImageList from "../models/userImageList.model";
import { IImageRepository } from "../interfaces/repositories/IImageRepository";
import imageModel from "../models/image.model";

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
  async findByTitle(title: string): Promise<boolean> {
    const image = await imageModel.findOne({ title });
    return !!image;
  }
  async updateImage(imageId: string, data: { title: string }): Promise<IImage> {
    const updated = await ImageModel.findByIdAndUpdate(
      imageId,
      { $set: data },
      { new: true }
    );
    if (!updated) throw new Error("Image not found");
    return updated;
  }

  async getImageById(imageId: string): Promise<IImage | null> {
    return ImageModel.findById(imageId);
  }

  async deleteImage(imageId: string): Promise<void> {
    await ImageModel.findByIdAndDelete(imageId);
  }
}
