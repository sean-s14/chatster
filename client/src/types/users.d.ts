// TODO: Implement ISelf interface
// interface ISelf {
//   id: number;
//   email: string;
//   username: string;
//   name?: string;

//   image: string | null;
//   image?: string;

//   role: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

interface IFriend {
  id: number;
  username: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IUser {
  id: number;
  username: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export { IFriend, IUser };
