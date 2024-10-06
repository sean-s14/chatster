import axiosInstance from "@/utils/axios-config";

async function deleteAccount(userId: number) {
  const url = `/api/users/${userId}`;

  try {
    const response = await axiosInstance.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
}

export default deleteAccount;
