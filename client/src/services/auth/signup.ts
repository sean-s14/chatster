import { AxiosResponse } from "axios";
import { SignupFormData } from "@/types/form-data";
import axiosInstance from "@/utils/axios-config";

interface SignupResponse {
  message: string;
}

async function signup(
  formData: SignupFormData
): Promise<AxiosResponse<SignupResponse>> {
  const url = "/api/auth/signup";

  try {
    const response = await axiosInstance.post(url, formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export default signup;
