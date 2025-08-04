import { IUser } from "../../models/user.model";
import { IBaseRepository } from "../../repositories/base.repository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
