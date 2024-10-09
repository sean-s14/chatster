import axiosInstance from "@/utils/axios-config";
import { IsFriend } from "@/types/api/friends";

async function isFriend(username: string): Promise<IsFriend> {
  const url = `/api/users/friends/is-friend/${username}`;
  const response = await axiosInstance.get<IsFriend>(url);
  return response.data;
}

export default isFriend;
