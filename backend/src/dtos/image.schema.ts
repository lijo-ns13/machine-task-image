import { z } from "zod";

export const createImageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid userId"),
  s3key: z.string(),
});

export type CreateImageInput = z.infer<typeof createImageSchema>;

export interface ImageDTO {
  id: string;
  title: string;
  userId: string;
  s3key: string;
  createdAt: Date;
  updatedAt: Date;
}
