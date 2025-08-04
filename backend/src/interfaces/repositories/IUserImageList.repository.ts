import { Types } from "mongoose";

export interface IUserImageListRepository {
  getOrCreateList(userId: Types.ObjectId): Promise<Types.ObjectId[]>;
  updateList(userId: Types.ObjectId, imageIds: string[]): Promise<void>;
  addImage(userId: Types.ObjectId, imageId: Types.ObjectId): Promise<void>;
}
