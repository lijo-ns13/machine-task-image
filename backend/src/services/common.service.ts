import jwt from "jsonwebtoken";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { TYPES } from "../di/types";
import { inject } from "inversify";

export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
};
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
// src/interfaces/services/ICommonService.ts

export interface ICommonService {
  refreshAccessToken(refreshToken?: string): Promise<{
    token: string;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "strict";
      maxAge: number;
    };
  }>;
}

export class CommonService implements ICommonService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async refreshAccessToken(refreshToken?: string) {
    if (!refreshToken) {
      throw { status: 401, message: "No refresh token provided" };
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as JwtPayload;
    } catch {
      throw { status: 403, message: "Invalid or expired refresh token" };
    }

    const user = await this._userRepo.findById(payload.userId);
    if (!user) throw { status: 401, message: "User not found" };

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );

    return {
      token: accessToken,
      cookieOptions: {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      },
    };
  }
}
