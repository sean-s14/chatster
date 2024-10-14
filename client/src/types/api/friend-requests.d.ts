type FriendRequestType = "ALL" | "SENT" | "RECEIVED";
type FriendRequestStatusType = "PENDING" | "ACCEPTED" | "REJECTED";
interface FriendRequestDetails {
  id: number;
  senderId: number;
  receiverId: number;
  status: $Enums.FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: number;
    username: string;
    image: string;
  };
  receiver: {
    id: number;
    username: string;
    image: string;
  };
}

interface GetFriendRequests {
  friendRequests: FriendRequestDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface GetFriendRequestsError {
  error: string;
}

interface GetFriendRequestCount {
  sentCount: number;
  receivedCount: number;
}

interface GetFriendRequestCountError {
  error: string;
}

interface SendFriendRequest {
  success: string;
}

interface SendFriendRequestError {
  error: string;
}

interface AcceptFriendRequest {
  success: string;
}

interface AcceptFriendRequestError {
  error: string;
}

interface RejectFriendRequest {
  success: string;
}

interface RejectFriendRequestError {
  error: string;
}

interface CancelFriendRequest {
  success: string;
}

interface CancelFriendRequestError {
  error: string;
}

export {
  FriendRequestType,
  FriendRequestStatusType,
  FriendRequestDetails,
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
  CancelFriendRequest,
  CancelFriendRequestError,
};
