// import { IUserImageListRepository } from "../interfaces/repositories/IUserImageList.repository";
// import UserImageListModel from "../models/userImageList.model";

// import { Types } from "mongoose";

// export class UserImageListRepository implements IUserImageListRepository {
//   async getOrCreateList(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
//     let list = await UserImageListModel.findOne({ userId }).lean();
//     if (!list) {
//       list = await UserImageListModel.create({ userId, imageIds: [] });
//     }
//     return list.imageIds;
//   }

//   async updateList(userId: Types.ObjectId, imageIds: string[]): Promise<void> {
//     const objectIds = imageIds.map((id) => new Types.ObjectId(id));
//     await UserImageListModel.findOneAndUpdate(
//       { userId },
//       { imageIds: objectIds },
//       { upsert: true }
//     );
//   }

//   async addImage(
//     userId: Types.ObjectId,
//     imageId: Types.ObjectId
//   ): Promise<void> {
//     await UserImageListModel.findOneAndUpdate(
//       { userId },
//       { $push: { imageIds: imageId } },
//       { upsert: true }
//     );
//   }
// }
