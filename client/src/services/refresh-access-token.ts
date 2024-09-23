import { AxiosInstance } from "axios";

export const refreshAccessToken = async (
  axiosInstance: AxiosInstance
): Promise<string> => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/token",
      {},
      {
        withCredentials: true,
      }
    );
    const newAccessToken = response.data.accessToken;
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};
