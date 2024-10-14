import axiosInstance from "@/utils/axios-config";
import type { GetFriendRequestCount } from "@/types/api/friend-requests";

async function getFriendRequestCount(): Promise<GetFriendRequestCount> {
  let url = "/api/users/friends/request/count";
  const response = await axiosInstance.get(url);
  return response.data;
}

export default getFriendRequestCount;
