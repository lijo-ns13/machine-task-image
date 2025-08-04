import { Router } from "express";

import { TYPES } from "../di/types";
import { IAuthController } from "../interfaces/controllers/IAuthController";
import container from "../di/container";

const router = Router();

// Resolve controller from DI container
const authController = container.get<IAuthController>(TYPES.AuthController);

// Routes
router.post("/auth/signup", authController.signup);
router.post("/auth/signin", authController.signin);

export default router;
