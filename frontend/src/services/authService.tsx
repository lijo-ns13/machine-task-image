import axios from "axios";
import { handleApiError } from "../types/apiError";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const SignInUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/signin`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    console.log("eroro", error);
    throw handleApiError(error, "authsignin");
  }
};
export const SignUpUser = async (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/signup`, data, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error, "authsignup");
  }
};
export const Logout = async () => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/logout`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "authlogut");
  }
};
