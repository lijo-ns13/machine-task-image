import { inject } from "inversify";
import { IAuthController } from "../interfaces/controllers/IAuthController";
import { TYPES } from "../di/types";
import { signinSchema, signupSchema } from "../validations/auth.validation";
import { IAuthService } from "../interfaces/services/IAuthService";
import { HTTP_STATUS_CODES } from "../constants/status.constant";
import { handleControllerError } from "../utils/errorHandler";
import { Request, Response } from "express";
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthController) private _authService: IAuthService
  ) {}
  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = signupSchema.parse(req.body);
      const result = await this._authService.signup(data);
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ success: true, message: "Signup successful", data: result });
    } catch (error) {
      handleControllerError(error, res, "AuthController.signup");
    }
  };

  signin = async (req: Request, res: Response): Promise<void> => {
    try {
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
