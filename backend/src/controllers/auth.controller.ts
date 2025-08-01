import { inject } from "inversify";
import { IAuthController } from "../interfaces/controllers/IAuthController";
import { TYPES } from "../di/types";

export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthController) private _) {}
  signup = async (req: Request, res: Response): Promise<void> => {};
  signIn = async (req: Request, res: Response): Promise<void> => {};
}
