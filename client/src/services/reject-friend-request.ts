import axiosInstance from "@/utils/axios-config";
import type { RejectFriendRequest } from "@/types/api/friend-requests";

async function rejectFriendRequest(
  requestId: number
): Promise<RejectFriendRequest> {
  const url = "/api/users/friends/request/reject";
  const data = { requestId };
  const response = await axiosInstance.patch(url, data);
  return response.data;
}

export default rejectFriendRequest;
