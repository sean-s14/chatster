import axiosInstance from "@/utils/axios-config";
import { RemoveFriend } from "@/types/api/friends";

async function removeFriend(userId: number): Promise<RemoveFriend> {
  const url = "/api/users/friends";
  const data = { friendId: userId };
  const response = await axiosInstance.delete(url, { data });
  return response.data;
}

export default removeFriend;
