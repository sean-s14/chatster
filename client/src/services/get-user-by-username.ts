import axiosInstance from "@/utils/axios-config";
import { GetUserByUsername } from "@/types/api/users";

async function getUserByUsername(username: string): Promise<GetUserByUsername> {
  const url = `/api/users/${username}`;
  const response = await axiosInstance.get(url);
  return response.data;
}

export default getUserByUsername;
