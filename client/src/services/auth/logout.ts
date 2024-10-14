import axios, { AxiosResponse } from "axios";
import { removeLocalStorageAccessToken } from "@/utils/auth/local-storage-access-token";

interface LogoutResponse {
  success: string;
}

async function logout(): Promise<AxiosResponse<LogoutResponse>> {
  const url = "/api/auth/logout";

  try {
    const response = await axios.post(
      url,
      {},
      {
        withCredentials: true,
      }
    );

    removeLocalStorageAccessToken();

    return response;
  } catch (error) {
    throw error;
  }
}

export default logout;
