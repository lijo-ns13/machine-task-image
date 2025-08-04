import { Router } from "express";

import { TYPES } from "../di/types";
import container from "../di/container";
import { IImageController } from "../interfaces/controllers/IImageController";
import multer from "multer";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3
const upload = multer({ storage });

export const uploadMedia = upload.single("media"); // 'media' should match your form field name

const router = Router();

// Resolve controller from DI container
const imageController = container.get<IImageController>(TYPES.ImageController);

router.post(
  "/image",
  uploadMedia,
  imageController.createImage.bind(imageController)
);
router.get(
  "/image/user/:userId",
  imageController.getUserImages.bind(imageController)
);
router.put(
  "/image/order",
  imageController.updateUserImageOrder.bind(imageController)
);

export default router;
