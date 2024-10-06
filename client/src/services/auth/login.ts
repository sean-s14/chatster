import { AxiosResponse } from "axios";
import { LoginFormData } from "@/types/form-data";
import axiosInstance from "@/utils/axios-config";
import { updateLocalStorageAccessToken } from "@/utils/auth/local-storage-access-token";

interface LoginResponse {
  accessToken: string;
}

async function login(
  loginFormData: LoginFormData
): Promise<AxiosResponse<LoginResponse>> {
  const url = "/api/auth/login";

  try {
    const response = await axiosInstance.post<LoginResponse>(url, {
      email: loginFormData.email,
      password: loginFormData.password,
    });

    updateLocalStorageAccessToken(response.data.accessToken);

    return response;
  } catch (error) {
    throw error;
  }
}

export default login;
