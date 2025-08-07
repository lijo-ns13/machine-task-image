import axios from "axios";
import { handleApiError } from "../types/apiError";

export const SignInUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/auth/signin`,
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
    const response = await axios.post(
      `http://localhost:5000/api/auth/signup`,
      data,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error, "authsignup");
  }
};
