import { SignupDTO } from "../dtos/auth.dto";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import userModel, { IUser } from "../models/user.model";

export class UserRepository implements IUserRepository {
  async create(data: SignupDTO): Promise<IUser> {
    const user = new userModel(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return userModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return userModel.findById(id);
  }

  async findAll(): Promise<IUser[]> {
    return userModel.find();
  }
}
