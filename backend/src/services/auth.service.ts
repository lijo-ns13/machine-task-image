import { TYPES } from "../di/types";
import { UserMapper } from "../mapping/auth.mapper";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util";
import { AuthResponseDTO, SigninDTO, SignupDTO } from "../dtos/auth.dto";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IAuthService } from "../interfaces/services/IAuthService";
import { inject } from "inversify";

export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}
  async signup(data: SignupDTO): Promise<AuthResponseDTO> {
    const existingUser = await this._userRepo.findByEmail(data.email);
    if (existingUser) throw new Error("Email already registered");

    const user = await this._userRepo.create(data);
    const payload = { userId: user._id.toString() };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: UserMapper.toSafeObject(user),
    };
  }

  async signin(data: SigninDTO): Promise<AuthResponseDTO> {
    const user = await this._userRepo.findByEmail(data.email);
    if (!user || !(await user.comparePassword(data.password))) {
      throw new Error("Invalid email or password");
    }

    const payload = { userId: user._id.toString() };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: UserMapper.toSafeObject(user),
    };
  }
}
