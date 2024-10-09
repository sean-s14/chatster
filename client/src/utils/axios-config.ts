import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import refreshAccessToken from "@/services/auth/refresh-access-token";
import logout from "@/services/auth/logout";
import { log } from "./logging";

async function refreshAccessTokenIfNotFound(
  config: InternalAxiosRequestConfig
) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    try {
      const response = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
    } catch (error) {
      log.error("Failed to refresh access token:", error);
    }
  }

  return config;
}

async function refreshAccessTokenOnErrorResponse(
  instance: AxiosInstance,
  error: AxiosError
) {
  const originalRequest = error.config;

  if (error.response?.status === 401 && originalRequest) {
    try {
      const response = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
      return instance(originalRequest);
    } catch (refreshError) {
      log.error("Failed to refresh access token:", refreshError);
      return Promise.reject(refreshError);
    }
  } else if (error.response?.status === 401) {
    logout();
  }

  return Promise.reject(error);
}

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
      config = await refreshAccessTokenIfNotFound(config);
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
    async (error: AxiosError) => {
      console.log("Error:", error);
      return await refreshAccessTokenOnErrorResponse(instance, error);
    }
  );

  return instance;
}

const axiosInstance = createAxiosInstance();
export default axiosInstance;
