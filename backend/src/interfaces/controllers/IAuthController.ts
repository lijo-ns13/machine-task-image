import { Request, Response } from "express";
export interface IAuthController {
  signup(req: Request, res: Response): Promise<void>;
  signIn(req: Request, res: Response): Promise<void>;
}
