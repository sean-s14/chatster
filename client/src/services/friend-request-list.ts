import axiosInstance from "@/utils/axios-config";
import type {
  FriendRequestStatusType,
  FriendRequestType,
  GetFriendRequests,
} from "@/types/api/friend-requests";

async function getFriendRequests({
  type,
  status,
  page,
  limit,
}: {
  type?: FriendRequestType;
  status?: FriendRequestStatusType;
  page?: number;
  limit?: number;
}): Promise<GetFriendRequests> {
  let url = "/api/users/friends/request";

  if (type || status || page || limit) {
    url += "?";
  }

  if (type) {
    url += `type=${type}&`;
  }

  if (status) {
    url += `status=${status}&`;
  }

  if (page) {
    url += `page=${page}&`;
  }

  if (limit) {
    url += `&limit=${limit}`;
  }

  // Remove trailing &
  url = url.replace(/&$/, "");

  const response = await axiosInstance.get(url);
  return response.data;
}

export default getFriendRequests;
