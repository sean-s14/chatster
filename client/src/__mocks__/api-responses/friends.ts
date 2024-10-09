import { AxiosResponse } from "axios";
import {
  GetFriends,
  GetFriendsError,
  AddFriend,
  AddFriendError,
  RemoveFriend,
  RemoveFriendError,
  IsFriend,
  IsFriendError,
} from "@/types/api/friends";

const getFriends: {
  success: AxiosResponse<GetFriends>;
  error: AxiosResponse<GetFriendsError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      friends: [
        {
          id: 1,
          username: "john_doe",
          image: "https://example.com/john_doe.jpg",
          createdAt: new Date("2023-05-01T12:00:00.000Z"),
          updatedAt: new Date("2023-05-01T12:00:00.000Z"),
        },
        {
          id: 2,
          username: "jane_doe",
          image: "https://example.com/jane_doe.jpg",
          createdAt: new Date("2023-05-01T12:00:00.000Z"),
          updatedAt: new Date("2023-05-01T12:00:00.000Z"),
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 10,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error fetching friends" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const addFriend: {
  success: AxiosResponse<AddFriend>;
  error: AxiosResponse<AddFriendError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: { success: "Friend added successfully" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error adding friend" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const removeFriend: {
  success: AxiosResponse<RemoveFriend>;
  error: AxiosResponse<RemoveFriendError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: { success: "Friend removed successfully" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error removing friend" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const isFriend: {
  success: {
    true: AxiosResponse<IsFriend>;
    false: AxiosResponse<IsFriend>;
  };
  error: AxiosResponse<IsFriendError>;
} = {
  success: {
    true: {
      status: 200,
      statusText: "OK",
      data: { isFriend: true },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    },
    false: {
      status: 200,
      statusText: "OK",
      data: { isFriend: false },
      headers: {
        "Content-Type": "application/json",
      },
      config: {} as any,
    },
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error checking friend status" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const mockResponses = {
  getFriends,
  addFriend,
  removeFriend,
  isFriend,
};

export default mockResponses;
