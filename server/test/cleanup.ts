import prisma from "../src/prismaClient";

async function cleanupDatabase(): Promise<void> {
  await prisma.friendRequest.deleteMany();
  await prisma.user.deleteMany();
}

export { cleanupDatabase };
