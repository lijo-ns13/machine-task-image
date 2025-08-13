import { injectable } from "inversify";
import { CreateImageInput } from "../dtos/image.schema";
import ImageModel, { IImage } from "../models/image.model";
import UserImageList from "../models/userImageList.model";
import { IImageRepository } from "../interfaces/repositories/IImageRepository";
import imageModel from "../models/image.model";
import mongoose from "mongoose";

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
  async findByTitles(titles: string[], userId: string): Promise<IImage[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return imageModel.find({
      title: { $in: titles },
      userId: userObjectId,
    });
  }
  async findByTitleExceptId(
    title: string,
    userId: string,
    excludeImageId: string
  ): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const image = await imageModel.findOne({
      title,
      userId: userObjectId,
      _id: { $ne: excludeImageId }, // exclude current image
    });
    return !!image;
  }

  async createImages(data: CreateImageInput[]): Promise<IImage[]> {
    const images = await ImageModel.insertMany(data);

    // Add all imageIds to UserImageList
    await UserImageList.findOneAndUpdate(
      { userId: data[0].userId },
      { $addToSet: { imageIds: { $each: images.map((img) => img._id) } } },
      { upsert: true, new: true }
    );

    return images.map((img) => img.toObject());
  }
  async findByTitle(title: string, userId: string): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const image = await imageModel.findOne({ title, userId: userObjectId });
    return !!image;
  }
  async updateImage(
    imageId: string,
    data: { title: string },
    s3key?: string
  ): Promise<IImage> {
    const updateData: Record<string, unknown> = { title: data.title };
    if (s3key) {
      updateData.s3key = s3key;
    }

    const updated = await ImageModel.findByIdAndUpdate(
      imageId,
      { $set: updateData },
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
