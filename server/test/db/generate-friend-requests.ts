import prisma from "../../src/prismaClient";
import { faker } from "@faker-js/faker";

/**
 * Gives each user in the database friend requests that total 5% to 15% of the other users
 * Example: If there are 100 users, each user will have 5 to 15 friend requests
 * ~1/3 will be pending, ~1/3 will be accepted, ~1/3 will be rejected
 */
export default async function generateFriendRequests() {
  const users = await prisma.user.findMany();
  const userIds = users.map((user) => user.id);
  const userCount = userIds.length;
  const minRequests = Math.floor(userCount * 0.05);
  const maxRequests = Math.floor(userCount * 0.15);
  const requests: any[] = [];
  for (const user of users) {
    const friends = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        friends: {
          select: {
            id: true,
          },
        },
      },
    });
    const friendIds = friends?.friends.map((friend) => friend.id) || [];

    // Get all existing PENDING friend requests
    const existingPendingRequests = await prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
            status: "PENDING",
          },
          {
            receiverId: user.id,
            status: "PENDING",
          },
        ],
      },
    });
    const existingRequestSenderIds = existingPendingRequests.map(
      (request) => request.senderId
    );
    const existingRequestReceiverIds = existingPendingRequests.map(
      (request) => request.receiverId
    );

    const validIdsForFriendRequest = Array.from(
      new Set([
        ...existingRequestSenderIds,
        ...existingRequestReceiverIds,
        ...friendIds,
      ])
    ).filter((id) => id !== user.id);

    const friendRequestIds = faker.helpers.arrayElements(
      validIdsForFriendRequest,
      {
        min: minRequests,
        max: maxRequests,
      }
    );

    for (const friendRequestId of friendRequestIds) {
      const friendRequest = {
        senderId: user.id,
        receiverId: friendRequestId,
        status: faker.helpers.arrayElement(["PENDING", "ACCEPTED", "REJECTED"]),
        createdAt: faker.date.between({
          from: "2020-01-01T00:00:00.000Z",
          to: "2023-01-01T00:00:00.000Z",
        }),
      };
      requests.push(friendRequest);
    }
  }

  await prisma.friendRequest.createMany({
    data: requests,
    skipDuplicates: true,
  });
}
