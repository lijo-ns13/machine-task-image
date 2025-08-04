import { Response } from "express";
import { ZodError, ZodIssue } from "zod";
import mongoose from "mongoose";
import logger from "./logger";
import { HTTP_STATUS_CODES } from "../constants/status.constant";

type MongoDuplicateError = {
  code: 11000;
  keyPattern: Record<string, number>;
  keyValue: Record<string, unknown>;
  message: string;
};

export function handleControllerError(
  error: unknown,
  res: Response,
  context?: string
): void {
  const logPrefix = context ? `[${context}]` : "[ErrorHandler]";

  // ✅ Zod validation error
  //   if (isZodError(error)) {
  //   const errors: Record<string, string> = Object.fromEntries(
  //     (error.errors as ZodIssue[]).map((issue) => [
  //       issue.path.join("."),
  //       issue.message,
  //     ])
  //   );

  //   logger.warn(`${logPrefix} Zod validation failed`, { errors });

  //   res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
  //     success: false,
  //     errors,
  //   });
  //   return;
  // }

  // ✅ Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};
    for (const [field, errObj] of Object.entries(error.errors)) {
      if (errObj instanceof mongoose.Error.ValidatorError) {
        errors[field] = errObj.message;
      }
    }

    logger.warn(`${logPrefix} Mongoose validation failed`, { errors });

    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      success: false,
      errors,
    });
    return;
  }

  // ✅ Duplicate key error (MongoDB)
  if (isMongoDuplicateKeyError(error)) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue?.[field];

    logger.warn(`${logPrefix} Duplicate key error`, { field, value });

    res.status(HTTP_STATUS_CODES.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
    return;
  }

  // ❌ Unknown or unhandled error
  logger.error(`${logPrefix} Unexpected error`, error);

  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error instanceof Error ? error.message : "Internal server error",
  });
}

// ✅ Type guard for ZodError (type-safe, no any)
function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}

// ✅ Type guard for Mongo duplicate key error
function isMongoDuplicateKeyError(err: unknown): err is MongoDuplicateError {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as Record<string, unknown>).code === 11000 &&
    "keyPattern" in err &&
    "keyValue" in err
  );
}
