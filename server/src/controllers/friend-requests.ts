import { Request, Response } from "express";
import prisma from "../prismaClient";
import { RequestWithUser } from "../types/user";

// TODO: Accept optional paramaters for status. Default to PENDING
async function getAllReceivedFriendRequests(
  req: Request,
  res: Response
): Promise<Response> {
  const { id: userId } = (req as RequestWithUser).user;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        receivedFriendRequests: true,
      },
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching friend requests" });
  }
}

// TODO: Accept optional paramaters for status. Default to PENDING
async function getAllSentFriendRequests(
  req: Request,
  res: Response
): Promise<Response> {
  const { id: userId } = (req as RequestWithUser).user;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        sentFriendRequests: true,
      },
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching friend requests" });
  }
}

async function sendFriendRequest(
  req: Request,
  res: Response
): Promise<Response> {
  const { friendId } = req.body;
  const { id: userId } = (req as RequestWithUser).user;

  if (friendId === userId) {
    return res
      .status(400)
      .json({ error: "Cannot send friend request to self" });
  }

  try {
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: Number(userId),
        receiverId: Number(friendId),
      },
    });
    return res.json({ success: "Friend request sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error sending friend request" });
  }
}

async function acceptFriendRequest(
  req: Request,
  res: Response
): Promise<Response> {
  const { requestId } = req.body;
  const { id: userId } = (req as RequestWithUser).user;

  try {
    const friendRequest = await prisma.friendRequest.update({
      where: { id: Number(requestId) },
      data: {
        status: "ACCEPTED",
      },
    });

    const receiver = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        friends: {
          connect: {
            id: Number(friendRequest.senderId),
          },
        },
      },
    });

    const sender = await prisma.user.update({
      where: { id: Number(friendRequest.senderId) },
      data: {
        friends: {
          connect: {
            id: Number(userId),
          },
        },
      },
    });

    return res.json({ success: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error accepting friend request" });
  }
}

async function rejectFriendRequest(
  req: Request,
  res: Response
): Promise<Response> {
  const { requestId } = req.body;

  try {
    const friendRequest = await prisma.friendRequest.update({
      where: { id: Number(requestId) },
      data: {
        status: "REJECTED",
      },
    });
    return res.json({ success: "Friend request rejected" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error rejecting friend request" });
  }
}

export {
  getAllReceivedFriendRequests,
  getAllSentFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
