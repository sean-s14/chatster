interface Friend {
  id: number;
  username: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface GetFriends {
  friends: Friend[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface GetFriendsError {
  error: string;
}

interface AddFriend {
  success: string;
}

interface AddFriendError {
  error: string;
}

interface RemoveFriend {
  success: string;
}

interface RemoveFriendError {
  error: string;
}

interface IsFriend {
  isFriend: boolean;
}

interface IsFriendError {
  error: string;
}

export {
  Friend,
  GetFriends,
  GetFriendsError,
  AddFriend,
  AddFriendError,
  RemoveFriend,
  RemoveFriendError,
  IsFriend,
  IsFriendError,
};
