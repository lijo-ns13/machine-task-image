import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { createImageSchema } from "../dtos/image.schema";
import { handleControllerError } from "../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../constants/status.constant";
import { IImageController } from "../interfaces/controllers/IImageController";
import { TYPES } from "../di/types";
import { IImageService } from "../interfaces/services/IImageService";
import { IMediaService } from "../interfaces/services/IMediaService";

@injectable()
export class ImageController implements IImageController {
  constructor(
    @inject(TYPES.ImageService) private imageService: IImageService,
    @inject(TYPES.MediaService) private mediaService: IMediaService
  ) {}

  async createImage(req: Request, res: Response): Promise<void> {
    console.log("mediaserv", this.mediaService);
    try {
      const { title, userId } = req.body;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Media file is required",
        });
        return;
      }

      // Upload to S3 and get back the s3key
      const s3key = await this.mediaService.uploadSingleMedia(req.file);
      console.log("s3key", s3key);
      // Validate input with Zod (including s3key)
      const parsed = createImageSchema.parse({ title, userId, s3key });

      // Save to DB
      const imageDTO = await this.imageService.createImage(parsed);

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Successfully created image",
        data: imageDTO,
      });
    } catch (error) {
      handleControllerError(error, res, "create-image");
    }
  }
  // updaetd
  async getUserImages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { images, total } =
        await this.imageService.getImagesInUserOrderPaginated(
          userId,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        message: "Images fetched in user order",
        data: {
          images,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      handleControllerError(error, res, "get-user-images");
    }
  }

  async updateUserImageOrder(req: Request, res: Response): Promise<void> {
    try {
      const { userId, imageIds } = req.body;

      if (!Array.isArray(imageIds) || !userId) {
        res.status(400).json({
          success: false,
          message: "userId and imageIds[] are required",
        });
      }

      await this.imageService.updateImageOrder(userId, imageIds);

      res.status(200).json({
        success: true,
        message: "Image order updated",
      });
    } catch (error) {
      handleControllerError(error, res, "update-image-order");
    }
  }
  async updateImage(req: Request, res: Response): Promise<void> {
    try {
      const imageId = req.params.imageId;
      const { title, userId } = req.body;

      if (!title || typeof title !== "string") {
        res.status(400).json({
          success: false,
          message: "Valid title is required",
        });
        return;
      }

      const updated = await this.imageService.updateImage(
        imageId,
        { title },
        userId
      );

      res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updated,
      });
    } catch (error) {
      handleControllerError(error, res, "update-image");
    }
  }
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const imageId = req.params.imageId;

      await this.imageService.deleteImage(imageId);

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "delete-image");
    }
  }
}
