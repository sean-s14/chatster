import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { customGenerateUsername } from "../utils/auth";

const prisma = new PrismaClient();

async function createUsers(count: number = 100) {
  const users: any[] = [];

  console.log("Generating users...");

  for (let i = 1; i <= count; i++) {
    const email = `user${String(i).padStart(3, "0")}@gmail.com`;
    const password = await bcrypt.hash("pass1234", 10);
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
  const userIds = users.map((user) => user.id);

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

async function main() {
  await createUsers();
  await giveUsersFriends();
  // TODO: Give each user 2-4 "PENDING", "ACCEPTED", and "REJECTED" friend requests
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
