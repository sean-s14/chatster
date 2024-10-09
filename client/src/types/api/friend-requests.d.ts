enum FriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: $Enums.FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface GetReceivedFriendRequests {
  receivedFriendRequests: FriendRequest[];
}

interface GetReceivedFriendRequestsError {
  error: string;
}

interface GetSentFriendRequests {
  sentFriendRequests: FriendRequest[];
}

interface GetSentFriendRequestsError {
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

export {
  FriendRequestStatus,
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
};
