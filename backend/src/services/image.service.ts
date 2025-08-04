import { inject, injectable } from "inversify";
import logger from "../utils/logger";
import { IImageService } from "../interfaces/services/IImageService";
import { TYPES } from "../di/types";
import { CreateImageInput, ImageDTO } from "../dtos/image.schema";
import { ImageMapper } from "../mapping/image.mapper";
import { IImageRepository } from "../interfaces/repositories/IImageRepository";

@injectable()
export class ImageService implements IImageService {
  private log = logger.child({ service: "ImageService" });

  constructor(
    @inject(TYPES.ImageRepository)
    private imageRepository: IImageRepository
  ) {}

  async createImage(data: CreateImageInput): Promise<ImageDTO> {
    const image = await this.imageRepository.createImage(data);
    return ImageMapper.toDTO(image);
  }
}
