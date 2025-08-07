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
}
