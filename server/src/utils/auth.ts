import prisma from "../prismaClient";
import { generateUsername } from "unique-username-generator";

async function customGenerateUsername(username?: string): Promise<string> {
  let isUnique = false;
  while (!isUnique || !username) {
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
