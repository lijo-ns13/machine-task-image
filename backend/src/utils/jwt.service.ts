// src/utils/jwt.util.ts
import jwt, { Secret } from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
}
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

const ACCESS_EXPIRY = "1h";
const REFRESH_EXPIRY = "7d";

export const signToken = (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: any
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (
  token: string,
  secret: Secret
): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err) {
    console.log("Token verification failed", err);
    return null;
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (err) {
    console.log("Token decoding failed", err);
    return null;
  }
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return signToken(payload, ACCESS_SECRET, ACCESS_EXPIRY);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return signToken(payload, REFRESH_SECRET, REFRESH_EXPIRY);
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  return verifyToken(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  return verifyToken(token, REFRESH_SECRET);
};
