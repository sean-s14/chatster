import prisma from "../../src/prismaClient";
import { faker } from "@faker-js/faker";

/**
 * Makes each user in the database friends with 5% to 15% of the other users
 */
export default async function generateFriends() {
  const users = await prisma.user.findMany();
  const userIds = users.map((user) => user.id);
  const userCount = userIds.length;
  const minFriends = Math.floor(userCount * 0.05);
  const maxFriends = Math.floor(userCount * 0.15);

  for (let i = 0; i < userCount; i++) {
    const user = users[i];
    const userIdsExcludingCurrentUser = userIds.filter((id) => id !== user.id);
    const friendIds = faker.helpers.arrayElements(userIdsExcludingCurrentUser, {
      min: minFriends,
      max: maxFriends,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        friends: {
          connect: friendIds.map((id) => ({ id })),
        },
      },
    });
  }
}
