interface User {
  id: number;
  username: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface GetUserByUsername extends User {}

interface GetUserByUsernameError {
  error: string;
}

interface GetUserByUsernameNotFoundError {
  error: string;
}

export {
  User,
  GetUserByUsername,
  GetUserByUsernameError,
  GetUserByUsernameNotFoundError,
};
