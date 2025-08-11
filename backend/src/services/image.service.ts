import { inject, injectable } from "inversify";
import logger from "../utils/logger";
import { IImageService } from "../interfaces/services/IImageService";
import { TYPES } from "../di/types";
import { CreateImageInput, ImageDTO } from "../dtos/image.schema";
import { ImageMapper } from "../mapping/image.mapper";
import { IImageRepository } from "../interfaces/repositories/IImageRepository";
import { IUserImageListRepository } from "../interfaces/repositories/IUserImageList.repository";
import { IMediaService } from "../interfaces/services/IMediaService";

@injectable()
export class ImageService implements IImageService {
  private log = logger.child({ service: "ImageService" });

  constructor(
    @inject(TYPES.ImageRepository)
    private imageRepository: IImageRepository,
    @inject(TYPES.UserImageListRepository)
    private userImageListRepository: IUserImageListRepository,
    @inject(TYPES.MediaService) private mediaService: IMediaService
  ) {}

  async createImage(data: CreateImageInput): Promise<ImageDTO> {
    const isTitleAlreadyExists = await this.imageRepository.findByTitle(
      data.title,
      data.userId
    );
    if (isTitleAlreadyExists) {
      throw new Error("Title already exists");
    }
    const image = await this.imageRepository.createImage(data);
    // await this.userImageListRepository.addImageToUserList(
    //   data.userId,
    //   image._id.toString()
    // );
    return ImageMapper.toDTO(image, this.mediaService);
  }
  async getImagesInUserOrderPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ images: ImageDTO[]; total: number }> {
    this.log.info("Fetching paginated images for userId %s", userId);

    const { images, total } =
      await this.userImageListRepository.getImagesInOrderPaginated(
        userId,
        page,
        limit
      );

    const dtoList = await Promise.all(
      images.map((img) => ImageMapper.toDTO(img, this.mediaService))
    );

    return { images: dtoList, total };
  }

  async updateImageOrder(userId: string, imageIds: string[]): Promise<void> {
    this.log.info("Updating image order for userId %s", userId);

    await this.userImageListRepository.updateImageOrder(userId, imageIds);
  }
  async updateImage(
    imageId: string,
    data: { title: string },
    userId: string
  ): Promise<ImageDTO> {
    const isTitleAlreadyExists = await this.imageRepository.findByTitle(
      data.title,
      userId
    );
    if (isTitleAlreadyExists) {
      throw new Error("Title already exists");
    }
    const updated = await this.imageRepository.updateImage(imageId, data);
    return ImageMapper.toDTO(updated, this.mediaService);
  }

  async deleteImage(imageId: string): Promise<void> {
    // Fetch image to get userId before deletion
    const image = await this.imageRepository.getImageById(imageId);
    if (!image) throw new Error("Image not found");

    await this.imageRepository.deleteImage(imageId);
    await this.userImageListRepository.removeImageFromUserList(
      image.userId.toString(),
      imageId
    );
  }
}
