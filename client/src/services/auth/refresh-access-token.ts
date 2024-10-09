import axios, { AxiosResponse } from "axios";
import { updateLocalStorageAccessToken } from "@/utils/auth/local-storage-access-token";

interface RefreshAccessTokenResponse {
  accessToken: string;
}

async function refreshAccessToken(): Promise<
  AxiosResponse<RefreshAccessTokenResponse>
> {
  const url = "/api/auth/token";

  try {
    const response = await axios.post(
      url,
      {},
      {
        withCredentials: true,
      }
    );

    updateLocalStorageAccessToken(response.data.accessToken);

    import.meta.env.DEV && console.log("Refreshed access token:", response);
    return response;
  } catch (error) {
    throw error;
  }
}

export default refreshAccessToken;
