import { Router } from "express";

import { TYPES } from "../di/types";
import container from "../di/container";
import { IImageController } from "../interfaces/controllers/IImageController";
import multer from "multer";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3
const upload = multer({ storage });

export const uploadMedia = upload.single("media"); // 'media' should match your form field name
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const imageController = container.get<IImageController>(TYPES.ImageController);

const router = Router();
router.use(authMiddleware.authenticate());

router.post(
  "/image",
  uploadMedia,
  imageController.createImage.bind(imageController)
);
router.post(
  "/images",
  uploadMedia,
  imageController.createImages.bind(imageController)
);
router.get(
  "/image/user/:userId",
  imageController.getUserImages.bind(imageController)
);
router.put(
  "/image/order",
  imageController.updateUserImageOrder.bind(imageController)
);
router.patch(
  "/image/:imageId",
  imageController.updateImage.bind(imageController)
);
router.delete(
  "/image/:imageId",
  imageController.deleteImage.bind(imageController)
);

export default router;
