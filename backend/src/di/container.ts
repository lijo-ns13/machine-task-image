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

const container = new Container();

container.bind<Model<IUser>>(TYPES.userModel).toConstantValue(userModel);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
// controller
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

export default container;
