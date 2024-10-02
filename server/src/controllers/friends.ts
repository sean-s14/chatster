import { Request, Response } from "express";
import prisma from "../prismaClient";
import { RequestWithUser } from "../types/user";

const safeFriendProperties = {
  id: true,
  username: true,
  image: true,
  createdAt: true,
};

async function getAllFriends(req: Request, res: Response): Promise<Response> {
  const { id: userId } = (req as RequestWithUser).user;

  try {
    const users = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        friends: {
          select: safeFriendProperties,
        },
      },
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching friends" });
  }
}

async function addFriend(req: Request, res: Response): Promise<Response> {
  const { friendId } = req.body;
  const { id: userId } = (req as RequestWithUser).user;

  if (friendId === userId) {
    return res.status(400).json({ error: "Cannot add self as friend" });
  }

  try {
    const user1 = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        friends: {
          connect: {
            id: Number(friendId),
          },
        },
      },
    });
    const user2 = await prisma.user.update({
      where: { id: Number(friendId) },
      data: {
        friends: {
          connect: {
            id: Number(userId),
          },
        },
      },
    });
    return res.json({ success: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error adding friend" });
  }
}

async function removeFriend(req: Request, res: Response): Promise<Response> {
  const { friendId } = req.body;
  const { id: userId } = (req as RequestWithUser).user;

  try {
    const user1 = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        friends: {
          disconnect: {
            id: Number(friendId),
          },
        },
      },
    });
    const user2 = await prisma.user.update({
      where: { id: Number(friendId) },
      data: {
        friends: {
          disconnect: {
            id: Number(userId),
          },
        },
      },
    });
    return res.json({ success: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error removing friend" });
  }
}

export { getAllFriends, addFriend, removeFriend };
