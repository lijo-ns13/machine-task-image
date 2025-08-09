import { title } from "process";
import { handleApiError } from "../types/apiError";
export interface ImageDTO {
  id: string;
  title: string;
  userId: string;
  s3key: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ImagePaginationResponse {
  images: ImageDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
import userAxios from "../types/axios";
const BASE_URL = "http://localhost:5000/api";

export const createImage = async (formData: FormData): Promise<ImageDTO> => {
  try {
    const response = await userAxios.post(`${BASE_URL}/image`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "create-image");
  }
};

export const getUserImages = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<ImagePaginationResponse> => {
  try {
    const response = await userAxios.get(`${BASE_URL}/image/user/${userId}`, {
      withCredentials: true,
      params: { page, limit },
    });

    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "get-user-images");
  }
};

export const updateImageOrder = async (
  userId: string,
  imageIds: string[]
): Promise<void> => {
  try {
    await userAxios.put(
      `${BASE_URL}/image/order`,
      { userId, imageIds },
      { withCredentials: true }
    );
  } catch (error) {
    throw handleApiError(error, "update-image-order");
  }
};
export const updateImage = async (
  imageId: string,
  title: string
): Promise<void> => {
  try {
    await userAxios.patch(
      `${BASE_URL}/image/${imageId}`,
      { title },
      { withCredentials: true }
    );
  } catch (error) {
    throw handleApiError(error, "update image");
  }
};
export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    await userAxios.delete(`${BASE_URL}/image/${imageId}`, {
      withCredentials: true,
    });
  } catch (error) {
    throw handleApiError(error, "delete image");
  }
};
