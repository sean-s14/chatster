import { AxiosInstance, AxiosResponse } from "axios";

export const logout = async (
  axiosInstance: AxiosInstance
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
