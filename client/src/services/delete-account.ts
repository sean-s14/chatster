import { AxiosInstance } from "axios";

export const deleteAccount = async (
  axiosInstance: AxiosInstance,
  userId: string
) => {
  try {
    const response = await axiosInstance.delete(`/api/users/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
