import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prismaClient";
import { customGenerateUsername } from "../utils/auth";

const safeUserProperties = {
  id: true,
  username: true,
  image: true,
  createdAt: true,
  updatedAt: true,
};

async function getAllUsers(req: Request, res: Response): Promise<Response> {
  try {
    const users = await prisma.user.findMany({
      select: safeUserProperties,
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching users" });
  }
}

async function getUserByUsername(
  req: Request,
  res: Response
): Promise<Response> {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: safeUserProperties,
    });
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error fetching user" });
  }
}

// TODO: Do not allow 'role' property to be set unless by superuser or admin
async function createUser(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;
  let { username } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    username = await customGenerateUsername(username);

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating user" });
  }
}

// TODO: Do not allow 'role' property to be set unless by superuser or admin
async function updateUser(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  const { name, username, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, username, email },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        name: true,
      },
    });
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Error updating user" });
  }
}

async function deleteUser(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Error deleting user" });
  }
}

export { getAllUsers, getUserByUsername, createUser, updateUser, deleteUser };
