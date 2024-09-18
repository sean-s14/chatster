import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user";
import { authenticateToken, authorizeUser } from "../middleware/auth";

const router: Router = Router();

// TODO: Add getUserByUsername route
router.get("/", getAllUsers);
router.get("/:id", authenticateToken, authorizeUser, getUserById);
// TODO: Add middleware for createUser route
router.post("/", createUser);
router.patch("/:id", authenticateToken, authorizeUser, updateUser);
router.delete("/:id", authenticateToken, authorizeUser, deleteUser);

export default router;
