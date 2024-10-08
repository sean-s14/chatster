import { beforeAll, afterAll } from "@jest/globals";
import prisma from "../src/prismaClient";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
