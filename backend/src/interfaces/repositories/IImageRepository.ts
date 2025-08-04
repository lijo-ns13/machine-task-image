import { CreateImageInput } from "../../dtos/image.schema";
import { IImage } from "../../models/image.model";

export interface IImageRepository {
  createImage(data: CreateImageInput): Promise<IImage>;
}
