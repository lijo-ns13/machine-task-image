// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

import { HTTP_STATUS_CODES } from "../constants/status.constant";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.service";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  authenticate = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: No access token" });
          return;
        }

        let decoded = verifyAccessToken(accessToken);
        let userPayload: AuthenticatedUser | null = null;

        if (!decoded) {
          if (!refreshToken) {
            res
              .status(HTTP_STATUS_CODES.UNAUTHORIZED)
              .json({ message: "Unauthorized: No refresh token" });
            return;
          }

          const decodedRefresh = verifyRefreshToken(refreshToken);
          if (!decodedRefresh) {
            res
              .status(HTTP_STATUS_CODES.UNAUTHORIZED)
              .json({ message: "Unauthorized: Invalid refresh token" });
            return;
          }

          const newAccessToken = generateAccessToken({
            id: decodedRefresh.id,
            email: decodedRefresh.email,
          });

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000, // 15 mins
          });

          decoded = verifyAccessToken(newAccessToken);
          userPayload = decodedRefresh;
        } else {
          userPayload = decoded;
        }

        if (!userPayload) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: Invalid token" });
          return;
        }

        req.user = {
          id: userPayload.id,
          email: userPayload.email,
        };

        next();
      } catch (error) {
        console.error("Auth Middleware Error:", error);
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }
    };
  };
}
