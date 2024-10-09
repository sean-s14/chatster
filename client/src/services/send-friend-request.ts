import axiosInstance from "@/utils/axios-config";
import { SendFriendRequest } from "@/types/api/friend-requests";

async function sendFriendRequest(userId: number): Promise<SendFriendRequest> {
  const url = "/api/users/friends/request";
  const data = { friendId: userId };
  const response = await axiosInstance.post(url, data);
  return response.data;
}

export default sendFriendRequest;
