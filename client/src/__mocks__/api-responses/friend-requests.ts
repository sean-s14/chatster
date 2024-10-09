import { FriendRequestStatus } from "@/types/api/friend-requests";
import { AxiosResponse } from "axios";
import {
  GetReceivedFriendRequests,
  GetReceivedFriendRequestsError,
  GetSentFriendRequests,
  GetSentFriendRequestsError,
  SendFriendRequest,
  SendFriendRequestError,
  AcceptFriendRequest,
  AcceptFriendRequestError,
  RejectFriendRequest,
  RejectFriendRequestError,
} from "@/types/api/friend-requests";

const getReceivedFriendRequests: {
  success: AxiosResponse<GetReceivedFriendRequests>;
  error: AxiosResponse<GetReceivedFriendRequestsError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      receivedFriendRequests: [
        {
          id: 1,
          senderId: 1,
          receiverId: 2,
          status: FriendRequestStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          senderId: 3,
          receiverId: 1,
          status: FriendRequestStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
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

const getSentFriendRequests: {
  success: AxiosResponse<GetSentFriendRequests>;
  error: AxiosResponse<GetSentFriendRequestsError>;
} = {
  success: {
    status: 200,
    statusText: "OK",
    data: {
      sentFriendRequests: [
        {
          id: 1,
          senderId: 1,
          receiverId: 2,
          status: FriendRequestStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          senderId: 3,
          receiverId: 1,
          status: FriendRequestStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
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
  getReceivedFriendRequests,
  getSentFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};

export default mockResponses;
