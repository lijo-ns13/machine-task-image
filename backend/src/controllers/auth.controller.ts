import { inject } from "inversify";
import { IAuthController } from "../interfaces/controllers/IAuthController";
import { TYPES } from "../di/types";
import { signinSchema, signupSchema } from "../validations/auth.validation";
import { IAuthService } from "../interfaces/services/IAuthService";
import { HTTP_STATUS_CODES } from "../constants/status.constant";

import { Request, Response } from "express";
import { handleControllerError } from "../utils/errorHandler";
import { ZodError, ZodIssue } from "zod";
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private _authService: IAuthService) {}
  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("req.body", req.body);
      const data = signupSchema.parse(req.body);
      console.log("data parsed", data);
      const result = await this._authService.signup(data);
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ success: true, message: "Signup successful", data: result });
    } catch (error) {
      handleControllerError(error, res, "userauthsignuperror");
    }
  };

  signin = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("req.body", req.body);
      const data = signinSchema.parse(req.body);
      const result = await this._authService.signin(data);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Signin successful", data: result });
    } catch (error) {
      handleControllerError(error, res, "AuthController.signin");
    }
  };
}
