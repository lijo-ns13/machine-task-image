import { Container } from "inversify";
import { TYPES } from "./types";
import userModel, { IUser } from "../models/user.model";
import { Model } from "mongoose";
import { IAuthController } from "../interfaces/controllers/IAuthController";
import { AuthController } from "../controllers/auth.controller";

const container = new Container();

container.bind<Model<IUser>>(TYPES.userModel).toConstantValue(userModel);

// controller

container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
