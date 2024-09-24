import { AxiosResponse } from "axios";
import { LoginFormData } from "@/types/form-data";
import createAxiosInstance from "@/utils/axios-config";

export const login = async (
  loginFormData: LoginFormData
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance();
  try {
    const response = await axiosInstance.post(
      "/api/auth/login",
      { email: loginFormData.email, password: loginFormData.password },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
