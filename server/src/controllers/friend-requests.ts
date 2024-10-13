import { Request, Response } from "express";
import prisma from "../prismaClient";
import { RequestWithUser } from "../types/user";
import { FriendRequestStatus } from "../types/friend-request";

const safeUserProperties = {
  id: true,
  username: true,
  image: true,
};

async function getFriendRequests(
  req: Request,
  res: Response
): Promise<Response> {
  const { id: userId } = (req as RequestWithUser).user;
  const status = req.query.status || "PENDING";
  const type = req.query.type || ("ALL" as "ALL" | "SENT" | "RECEIVED");

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  function generateWhereClause(type: string) {
    let whereClause = {};
    if (type === "SENT") {
      whereClause = {
        senderId: Number(userId),
        status: status as FriendRequestStatus,
      };
    } else if (type === "RECEIVED") {
      whereClause = {
        receiverId: Number(userId),
        status: status as FriendRequestStatus,
      };
    } else {
      whereClause = {
        OR: [
          {
            senderId: Number(userId),
            status: status as FriendRequestStatus,
          },
          {
            receiverId: Number(userId),
            status: status as FriendRequestStatus,
          },
        ],
      };
    }
    return whereClause;
  }
  const whereClause = generateWhereClause(type.toString());

  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: whereClause,
      include: {
        sender: {
          select: safeUserProperties,
        },
        receiver: {
          select: safeUserProperties,
        },
      },
      skip: skip,
      take: limit,
    });

    const totalCount = await prisma.friendRequest.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      friendRequests,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching friend requests" });
  }
}

async function getFriendRequestCount(
  req: Request,
  res: Response
): Promise<Response> {
  const { id: userId } = (req as RequestWithUser).user;

  try {
    const sentCount = await prisma.friendRequest.count({
      where: {
        senderId: userId,
        status: "PENDING",
      },
    });

    const receivedCount = await prisma.friendRequest.count({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
    });

    return res.json({
      sentCount,
      receivedCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching friend request count" });
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
    const existingFriendship = await prisma.user.findFirst({
      where: {
        id: Number(userId),
        friends: {
          some: {
            id: Number(friendId),
          },
        },
      },
    });

    if (existingFriendship) {
      return res
        .status(400)
        .json({ error: "You are already friends with this user" });
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: Number(userId), receiverId: Number(friendId) },
          { senderId: Number(friendId), receiverId: Number(userId) },
        ],
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "Pending friend request already exists" });
    }

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

async function cancelFriendRequest(
  req: Request,
  res: Response
): Promise<Response> {
  const { requestId } = req.body;

  try {
    const friendRequest = await prisma.friendRequest.delete({
      where: { id: Number(requestId) },
    });

    return res.json({ success: "Friend request cancelled" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error cancelling friend request" });
  }
}

export {
  getFriendRequests,
  getFriendRequestCount,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
};
