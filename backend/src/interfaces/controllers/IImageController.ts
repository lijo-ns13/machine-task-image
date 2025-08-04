import { Request, Response } from "express";

export interface IImageController {
  createImage(req: Request, res: Response): Promise<void>;
}
