import { SignupFormData } from "@/types/form-data";
import createAxiosInstance from "@/utils/axios-config";

export const signup = async (formData: SignupFormData) => {
  const axiosInstance = createAxiosInstance();
  try {
    const response = await axiosInstance.post("/api/auth/signup", formData);
    return response;
  } catch (error) {
    throw error;
  }
};
