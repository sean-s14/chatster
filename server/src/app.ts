import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Define a route
app.get("/", async (req: Request, res: Response) => {
  const result =
    await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
  console.log(result);
  res.send("Hello, TypeScript!");
});

app.post("/user/add", async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
    };

    const result = await prisma.user.create({
      data: user,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

// Check database connection
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Prisma Client disconnected");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Prisma Client disconnected");
    process.exit(0);
  });
});
