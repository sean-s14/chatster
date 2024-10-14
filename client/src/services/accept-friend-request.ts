import axiosInstance from "@/utils/axios-config";
import type { AcceptFriendRequest } from "@/types/api/friend-requests";

async function acceptFriendRequest(
  requestId: number
): Promise<AcceptFriendRequest> {
  const url = "/api/users/friends/request/accept";
  const data = { requestId };
  const response = await axiosInstance.patch(url, data);
  return response.data;
}

export default acceptFriendRequest;
