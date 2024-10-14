import axiosInstance from "@/utils/axios-config";
import type { CancelFriendRequest } from "@/types/api/friend-requests";

async function cancelFriendRequest(
  requestId: number
): Promise<CancelFriendRequest> {
  const url = "/api/users/friends/request/cancel";
  const data = { data: { requestId } };
  const response = await axiosInstance.delete(url, data);
  return response.data;
}

export default cancelFriendRequest;
