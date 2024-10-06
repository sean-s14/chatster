import axios from "axios";
import refreshAccessToken from "@/services/auth/refresh-access-token";
import { updateLocalStorageAccessToken } from "./auth/local-storage-access-token";

function createAxiosInstance() {
  const instance = axios.create({
    baseURL: "",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      console.log("Request:", config);
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        try {
          const response = await refreshAccessToken();
          updateLocalStorageAccessToken(response.data.accessToken);
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        } catch (error) {
          console.error("Failed to refresh access token:", error);
        }
      }

      return config;
    },
    (error) => {
      console.log("Error:", error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log("Response:", response);
      return response;
    },
    (error) => {
      console.log("Error:", error);
      return Promise.reject(error);
    }
  );

  return instance;
}

const axiosInstance = createAxiosInstance();
export default axiosInstance;
