import { Router } from "express";
import {
  getAllFriends,
  addFriend,
  removeFriend,
  isFriend,
} from "../controllers/friends";
import { authenticateToken } from "../middleware/auth";
import friendRequestRoutes from "./friend-requests";

const router: Router = Router();

router.use("/request", friendRequestRoutes);

router.get("/", authenticateToken, getAllFriends);
router.patch("/", authenticateToken, addFriend);
router.delete("/", authenticateToken, removeFriend);
router.get("/is-friend/:username", authenticateToken, isFriend);

export default router;
