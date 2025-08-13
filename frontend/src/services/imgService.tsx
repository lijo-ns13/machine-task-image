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
const baseUrl = import.meta.env.VITE_API_BASE_URL;
// const BASE_URL = `${import.meta.env.VITE_API_BASE_UR}/api`;

export const createImage = async (formData: FormData): Promise<ImageDTO> => {
  try {
    const response = await userAxios.post(`${baseUrl}/api/image`, formData, {
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
    const response = await userAxios.get(
      `${baseUrl}/api/image/user/${userId}`,
      {
        withCredentials: true,
        params: { page, limit },
      }
    );

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
      `${baseUrl}/api/image/order`,
      { userId, imageIds },
      { withCredentials: true }
    );
  } catch (error) {
    throw handleApiError(error, "update-image-order");
  }
};
export const createMultipleImages = async (
  formData: FormData
): Promise<ImageDTO[]> => {
  try {
    const response = await userAxios.post(
      `${baseUrl}/api/image/multiple`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "create-multiple-images");
  }
};
export const updateImage = async (
  imageId: string,
  title: string,
  userId: string,
  file?: File
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("userId", userId);
    if (file) {
      formData.append("media", file); // must match multer field name
    }

    await userAxios.patch(`${baseUrl}/api/image/${imageId}`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw handleApiError(error, "update image");
  }
};

export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    await userAxios.delete(`${baseUrl}/api/image/${imageId}`, {
      withCredentials: true,
    });
  } catch (error) {
    throw handleApiError(error, "delete image");
  }
};
export async function changePassword(
  currentPassword: string,
  newPassword: string,
  userId: string
) {
  try {
    const res = await userAxios.patch(`${baseUrl}/api/changepassword`, {
      currentPassword,
      newPassword,
      userId,
    });
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "change password");
  }
}
