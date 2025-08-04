import { IUser } from "../models/user.model";

export class UserMapper {
  static toSafeObject(user: IUser) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
