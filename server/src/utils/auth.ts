import prisma from "../prismaClient";
import { generateUsername } from "unique-username-generator";

async function customGenerateUsername(username?: string) {
  let isUnique = false;
  while (!isUnique) {
    if (!username) {
      username = generateUsername("-", 2, 20);
    }
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (!existingUsername) {
      isUnique = true;
    } else {
      username = undefined;
    }
  }
  return username;
}

export { customGenerateUsername };
