import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import container from "../di/container";
import { ICommonController } from "../controllers/common.controller";
import { TYPES } from "../di/types";
const commonController = container.get<ICommonController>(
  TYPES.CommonController
);

const router = Router();

router.post("/refresh", commonController.refreshAccessToken);

export default router;
