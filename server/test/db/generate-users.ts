import prisma from "../../src/prismaClient";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { customGenerateUsername } from "../../src/utils/auth";

export default async function generateUsers(count: number = 100) {
  const users: any[] = [];
  for (let i = 1; i <= count; i++) {
    const email = `user${String(i).padStart(3, "0")}@mail.com`;
    const password = await bcrypt.hash("pass1234", 6);
    const username = await customGenerateUsername();
    const image = faker.image.avatar();
    const createdAt = faker.date.between({
      from: "2020-01-01T00:00:00.000Z",
      to: "2023-01-01T00:00:00.000Z",
    });

    users.push({
      email,
      password,
      username,
      image,
      createdAt,
    });
  }

  const prismaUsers = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  return prismaUsers;
}
