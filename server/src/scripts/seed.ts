import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { customGenerateUsername } from "../utils/auth";
import { User } from "../types/user";

const prisma = new PrismaClient();

async function createUsers(count: number = 100) {
  interface User {
    email: string;
    password: string;
    username: string;
    image: string;
  }
  const users: User[] = [];

  console.log("Generating users...");

  for (let i = 1; i <= count; i++) {
    const email = `user${String(i).padStart(3, "0")}@gmail.com`;
    const password = await bcrypt.hash("pass1234", 7);
    const username = await customGenerateUsername();
    const image = faker.image.avatar();

    users.push({
      email,
      password,
      username,
      image,
    });

    const percentage = ((i / count) * 100).toFixed(0);
    process.stdout.write(`Progress: ${percentage}%\r`);
  }

  console.log("Adding users to the database...");

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // Avoids any duplication errors if applicable
  });

  console.log(`${count} users created`);
}

async function giveUsersFriends(
  { min, max }: { min: number; max: number } = { min: 30, max: 60 }
) {
  let updatedUsers = 0;
  const users = await prisma.user.findMany();
  const userIds = users.map((user: User) => user.id);

  console.log("Giving users friends...");

  for (const user of users) {
    const friendIds = faker.helpers.arrayElements(userIds, {
      min,
      max,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        friends: {
          connect: friendIds.map((id) => ({ id })),
        },
      },
    });

    updatedUsers++;
    const percentage = ((updatedUsers / users.length) * 100).toFixed(0);

    process.stdout.write(`Progress: ${percentage}%\r`);
  }
  console.log(`${users.length} users given friends`);
}

async function giveUsersFriendRequests(
  { min, max }: { min: number; max: number } = { min: 3, max: 12 }
) {
  let updatedUsers = 0;
  const users = await prisma.user.findMany({
    include: {
      friends: {
        select: {
          id: true,
        },
      },
    },
  });

  console.log("Giving users friend requests...");

  let existingFriendRequestPairs: [number, number][] = [];

  // Generate ACCEPTED and REJECTED friend requests
  let acceptedAndRejectedFriendRequestCount = 0;
  for (const user of users) {
    type STATUS_TYPES = "ACCEPTED" | "REJECTED";
    interface FriendRequest {
      senderId: number;
      receiverId: number;
      status: STATUS_TYPES;
    }
    let friendRequests: FriendRequest[] = [];
    const STATUS_TYPES: STATUS_TYPES[] = ["ACCEPTED", "REJECTED"];
    const numFriendRequests = faker.number.int({ min, max });
    for (let i = 0; i < numFriendRequests; i++) {
      const status = faker.helpers.arrayElement(STATUS_TYPES);
      const userIds = users.map((user: User) => user.id);
      const filteredUserIds = userIds.filter(
        (id: number) => id !== (user as User).id
      );
      const friendRequest: FriendRequest = {
        senderId: user.id,
        receiverId: faker.helpers.arrayElement(filteredUserIds),
        status,
      };
      acceptedAndRejectedFriendRequestCount++;
      friendRequests.push(friendRequest);
    }
    await prisma.friendRequest.createMany({
      data: friendRequests,
    });
  }
  console.log(
    `Generated ${acceptedAndRejectedFriendRequestCount} accepted and rejected friend requests`
  );

  // ===== Generate unique pending friend requests for each user =====
  let pendingFriendRequestCount = 0;
  for (const user of users) {
    // All users who are not friends with the current user
    interface Friend {
      id: number;
    }
    const nonFriendIds = users
      .map((user: User) => user.id)
      .filter(
        (id: number) =>
          !user.friends.map((friend: Friend) => friend.id).includes(id)
      );

    // create a filtered list of items from existingFriendRequestPairs that contain the current user's id
    const existingFriendRequestPairsForUser = existingFriendRequestPairs.filter(
      ([senderId, receiverId]) => senderId === user.id || receiverId === user.id
    );

    // convert existingFriendRequestPairsForUser to a number[] without the current user's id
    const existingFriendRequestPairsForUserWithoutCurrentUser =
      existingFriendRequestPairsForUser.filter(
        ([senderId, receiverId]) =>
          senderId !== user.id && receiverId !== user.id
      );

    // Get a unique list of ids using both nonFriendIds and existingFriendRequestPairsForUserWithoutCurrentUser
    const uniqueIds = [
      ...nonFriendIds,
      ...existingFriendRequestPairsForUserWithoutCurrentUser.flat(),
    ];

    if (uniqueIds.length === 0) {
      continue;
    }

    if (uniqueIds.length < max) {
      max = uniqueIds.length;
    }

    if (uniqueIds.length < min) {
      min = 1;
    }

    const randomNumberBetweenMinAndMax =
      Math.floor(Math.random() * (max - min + 1)) + min;

    const friendRequests = uniqueIds
      .slice(0, randomNumberBetweenMinAndMax)
      .map((id) => ({
        senderId: user.id,
        receiverId: id,
        status: "PENDING" as "PENDING",
      }));

    await prisma.friendRequest.createMany({
      data: friendRequests,
    });

    pendingFriendRequestCount += friendRequests.length;
    updatedUsers++;
    const percentage = ((updatedUsers / users.length) * 100).toFixed(0);
    process.stdout.write(`Progress: ${percentage}%\r`);
  }
  console.log(`Generated ${pendingFriendRequestCount} pending friend requests`);

  console.log(`${users.length} users given friend requests`);
}

async function main() {
  const userCount = parseInt(process.argv[2]) || 100;

  const minFriends = parseInt(process.argv[3]) || 30;
  const maxFriends = parseInt(process.argv[4]) || 60;

  const minRequests = parseInt(process.argv[5]) || 3;
  const maxRequests = parseInt(process.argv[6]) || 12;

  await createUsers(userCount);
  await giveUsersFriends({ min: minFriends, max: maxFriends });
  await giveUsersFriendRequests({ min: minRequests, max: maxRequests });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
