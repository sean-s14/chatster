import prisma from "../src/prismaClient";
import { AccessTokenPayload } from "../src/types/user";
import { customGenerateUsername } from "../src/utils/auth";
import bcrypt from "bcrypt";

async function createUser(
  email: string,
  password: string
): Promise<AccessTokenPayload> {
  const username = await customGenerateUsername();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  const userData: AccessTokenPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name || undefined,
    image: user.image || undefined,
    role: user.role,
  };

  return userData;
}

export { createUser };
