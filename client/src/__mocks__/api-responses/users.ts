import { AxiosResponse } from "axios";
import {
  GetUserByUsername,
  GetUserByUsernameError,
  GetUserByUsernameNotFoundError,
} from "@/types/api/users";

const getUserByUsername: {
  success: AxiosResponse<GetUserByUsername>;
  notFound: AxiosResponse<GetUserByUsernameNotFoundError>;
  error: AxiosResponse<GetUserByUsernameError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      id: 1,
      username: "john_doe",
      image: "https://example.com/john_doe.jpg",
      createdAt: new Date("2023-05-01T12:00:00.000Z"),
      updatedAt: new Date("2023-05-01T12:00:00.000Z"),
    },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  notFound: {
    status: 404,
    statusText: "Not Found",
    data: { error: "User not found" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error fetching user" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const mockResponses = {
  getUserByUsername,
};

export default mockResponses;
