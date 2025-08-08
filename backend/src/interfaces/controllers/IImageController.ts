import { Request, Response } from "express";

export interface IImageController {
  createImage(req: Request, res: Response): Promise<void>;
  getUserImages(req: Request, res: Response): Promise<void>;
  updateUserImageOrder(req: Request, res: Response): Promise<void>;
  updateImage(req: Request, res: Response): Promise<void>;
  deleteImage(req: Request, res: Response): Promise<void>;
}
