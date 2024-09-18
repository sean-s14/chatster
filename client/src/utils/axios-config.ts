import axios from "axios";

// TODO: Update when nginx is configured
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

function createAxiosInstance(bearer_token?: string) {
  const instance = axios.create({
    baseURL: SERVER_BASE_URL + "/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      console.log("Request:", config);
      if (bearer_token) {
        config.headers.Authorization = `Bearer ${bearer_token}`;
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

export default createAxiosInstance;
