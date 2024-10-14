import { AxiosError } from "axios";
import { user, accessToken } from "./mock-user-data";

const signupMockResponse = {
  success: {
    status: 201,
    statusText: "Created",
    data: { success: "User created" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  serverError: new AxiosError(
    "Internal Server Error",
    "500",
    undefined,
    undefined,
    {
      status: 500,
      statusText: "Internal Server Error",
      data: { error: "Something went wrong" },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    }
  ),
  shortPassword: new AxiosError(
    "Password must be at least 8 characters long",
    "400",
    undefined,
    undefined,
    {
      status: 400,
      statusText: "Bad Request",
      data: {
        errors: { password: "Password must be at least 8 characters long" },
      },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    }
  ),
  existingEmail: new AxiosError(
    "User already exists with this email",
    "400",
    undefined,
    undefined,
    {
      status: 400,
      statusText: "Bad Request",
      data: {
        errors: { email: "User already exists with this email" },
      },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    }
  ),
};

const loginMockResponse = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      user,
      accessToken,
    },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  incorrectPassword: new AxiosError(
    "Incorrect password",
    "400",
    undefined,
    undefined,
    {
      status: 400,
      statusText: "Bad Request",
      data: { errors: { password: "Incorrect password" } },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    }
  ),
  serverError: new AxiosError(
    "Internal Server Error",
    "500",
    undefined,
    undefined,
    {
      status: 500,
      statusText: "Internal Server Error",
      data: { error: "Something went wrong" },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    }
  ),
  noUserWithThisEmail: new AxiosError(
    "No user exists with this email",
    "404",
    undefined,
    undefined,
    {
      status: 404,
      statusText: "Not Found",
      data: { errors: { email: "No user exists with this email" } },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    }
  ),
};

const logoutMockResponse = {
  success: {
    status: 200,
    statusText: "OK",
    data: { success: "Logged out" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const refreshAccessTokenMockResponse = {
  success: {
    status: 200,
    statusText: "OK",
    data: { accessToken },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  unauthorized: new AxiosError("Unauthorized", "401", undefined, undefined, {
    status: 401,
    statusText: "Unauthorized",
    data: { error: "Unauthorized" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  }),
};

const deleteAccountMockResponse = {
  success: {
    status: 204,
    statusText: "No Content",
    data: null,
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  serverError: new AxiosError(
    "Internal Server Error",
    "500",
    undefined,
    undefined,
    {
      status: 500,
      statusText: "Internal Server Error",
      data: { error: "Error deleting user" },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    }
  ),
};

const mockResponse = {
  signup: signupMockResponse,
  login: loginMockResponse,
  logout: logoutMockResponse,
  refreshAccessToken: refreshAccessTokenMockResponse,
  deleteAccount: deleteAccountMockResponse,
};

export default mockResponse;
