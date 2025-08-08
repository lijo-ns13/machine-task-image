import { Container } from "inversify";
import { TYPES } from "./types";
import userModel, { IUser } from "../models/user.model";
import { Model } from "mongoose";
import { IAuthController } from "../interfaces/controllers/IAuthController";
import { AuthController } from "../controllers/auth.controller";
import { IAuthService } from "../interfaces/services/IAuthService";
import { AuthService } from "../services/auth.service";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { UserRepository } from "../repositories/user.repository";
import { IImageController } from "../interfaces/controllers/IImageController";
import { IImageRepository } from "../interfaces/repositories/IImageRepository";
import { IImageService } from "../interfaces/services/IImageService";
import { ImageService } from "../services/image.service";
import { ImageRepository } from "../repositories/image.repository";
import { ImageController } from "../controllers/image.controller";
import { IMediaService } from "../interfaces/services/IMediaService";
import { MediaService } from "../services/media.service";
import { IUserImageListRepository } from "../interfaces/repositories/IUserImageList.repository";
import { UserImageListRepository } from "../repositories/userimage.repository";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { CommonService, ICommonService } from "../services/common.service";
import {
  CommonController,
  ICommonController,
} from "../controllers/common.controller";

const container = new Container();

container.bind<Model<IUser>>(TYPES.userModel).toConstantValue(userModel);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
// controller
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IImageController>(TYPES.ImageController).to(ImageController);
container.bind<IImageService>(TYPES.ImageService).to(ImageService);
container.bind<IImageRepository>(TYPES.ImageRepository).to(ImageRepository);
container.bind<IMediaService>(TYPES.MediaService).to(MediaService);
container
  .bind<IUserImageListRepository>(TYPES.UserImageListRepository)
  .to(UserImageListRepository);
container.bind<IAuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<ICommonService>(TYPES.CommonService).to(CommonService);
container.bind<ICommonController>(TYPES.CommonController).to(CommonController);
export default container;
