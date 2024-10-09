import axiosInstance from "@/utils/axios-config";
import { GetFriends } from "@/types/api/friends";

async function getFriendList(pagination?: {
  page?: number;
  limit?: number;
}): Promise<GetFriends> {
  let url = "/api/users/friends";

  if (pagination?.page || pagination?.limit) {
    url += "?";
    if (pagination?.page) {
      url += `page=${pagination.page}&`;
    }
    if (pagination?.limit) {
      url += `limit=${pagination.limit}`;
    }
  }

  const response = await axiosInstance.get(url);
  return response.data;
}

export default getFriendList;
