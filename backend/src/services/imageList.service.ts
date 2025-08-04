// import { inject, injectable } from "inversify";

// import { TYPES } from "../di/types";
// import { Types } from "mongoose";

// import { ImageMapper } from "../mapping/image.mapper";
// import { MediaService } from "./media.service";
// import { IImageListService } from "../interfaces/services/IImageListService";
// import { ImageResponseDTO } from "../dtos/image.schema";

// @injectable()
// export class ImageService implements IImageListService {
//   constructor(
//     @inject(TYPES.UserImageListRepository)
//     private imageListRepo: IUserImageListRepository,
//     @inject(TYPES.ImageRepository) private imageRepo: ImageRepository,
//     @inject(TYPES.MediaService) private mediaService: MediaService
//   ) {}

//   async getUserImagesOrdered(
//     userId: Types.ObjectId
//   ): Promise<ImageResponseDTO[]> {
//     const imageIds = await this.imageListRepo.getOrCreateList(userId);
//     const images = await this.imageRepo.getImagesByIds(imageIds);
//     const imageMap = new Map(images.map((img) => [img._id.toString(), img]));

//     const ordered = imageIds
//       .map((id) => imageMap.get(id.toString()))
//       .filter((img): img is (typeof images)[number] => Boolean(img));

//     return Promise.all(
//       ordered.map(async (img) => ({
//         ...ImageMapper.toDTO(img),
//         signedUrl: await this.mediaService.getMediaUrl(img.s3key),
//       }))
//     );
//   }

//   async reorderUserImages(
//     userId: Types.ObjectId,
//     imageIdsInOrder: string[]
//   ): Promise<void> {
//     await this.imageListRepo.updateList(userId, imageIdsInOrder);
//   }
// }
