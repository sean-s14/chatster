import { Router } from "express";
import {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user";
import { authenticateToken, authorizeUser } from "../middleware/auth";
import friendRoutes from "./friends";

const router: Router = Router();

router.use("/friends", friendRoutes);

router.get("/", getAllUsers);
router.get("/:username", authenticateToken, getUserByUsername);
// TODO: Add middleware for createUser route
router.post("/", createUser);
router.patch("/:id", authenticateToken, authorizeUser, updateUser);
router.delete("/:id", authenticateToken, authorizeUser, deleteUser);

export default router;
