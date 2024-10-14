import { AxiosResponse } from "axios";
import { FriendRequestStatusEnum } from "@/types/api/friend-request-enums";
import type {
  GetFriendRequests,
  GetFriendRequestsError,
  GetFriendRequestCount,
  GetFriendRequestCountError,
  SendFriendRequest,
  SendFriendRequestError,
  AcceptFriendRequest,
  AcceptFriendRequestError,
  RejectFriendRequest,
  RejectFriendRequestError,
} from "@/types/api/friend-requests";

const generateFakeFriendRequest = (
  id: number,
  senderId: number,
  receiverId: number
): GetFriendRequests["friendRequests"][number] => ({
  id,
  senderId,
  receiverId,
  status: FriendRequestStatusEnum.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
  sender: {
    id: senderId,
    username: `user${senderId}`,
    image: "sender.jpg",
  },
  receiver: {
    id: receiverId,
    username: `user${receiverId}`,
    image: "receiver.jpg",
  },
});

const getFriendRequests: {
  success: AxiosResponse<GetFriendRequests>;
  error: AxiosResponse<GetFriendRequestsError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      friendRequests: [
        generateFakeFriendRequest(1, 1, 2),
        generateFakeFriendRequest(2, 3, 1),
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
    data: { error: "Error fetching friend requests" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const getTenFriendRequests: {
  success: AxiosResponse<GetFriendRequests>;
  error: AxiosResponse<GetFriendRequestsError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      friendRequests: [
        generateFakeFriendRequest(1, 1, 2),
        generateFakeFriendRequest(2, 1, 3),
        generateFakeFriendRequest(3, 1, 4),
        generateFakeFriendRequest(4, 1, 5),
        generateFakeFriendRequest(5, 1, 6),
        generateFakeFriendRequest(6, 1, 7),
        generateFakeFriendRequest(7, 8, 1),
        generateFakeFriendRequest(8, 9, 1),
        generateFakeFriendRequest(9, 10, 1),
        generateFakeFriendRequest(10, 11, 1),
      ],
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 12,
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
    data: { error: "Error fetching friend requests" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const getFriendRequestCount: {
  success: AxiosResponse<GetFriendRequestCount>;
  error: AxiosResponse<GetFriendRequestCountError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      sentCount: 2,
      receivedCount: 1,
    },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error fetching friend request count" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const sendFriendRequest: {
  success: AxiosResponse<SendFriendRequest>;
  error: AxiosResponse<SendFriendRequestError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: { success: "Friend request sent" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error sending friend request" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const acceptFriendRequest: {
  success: AxiosResponse<AcceptFriendRequest>;
  error: AxiosResponse<AcceptFriendRequestError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: { success: "Friend request accepted" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error accepting friend request" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const rejectFriendRequest: {
  success: AxiosResponse<RejectFriendRequest>;
  error: AxiosResponse<RejectFriendRequestError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: { success: "Friend request rejected" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  error: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error rejecting friend request" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const mockResponses = {
  getFriendRequests,
  getTenFriendRequests,
  getFriendRequestCount,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};

export default mockResponses;
