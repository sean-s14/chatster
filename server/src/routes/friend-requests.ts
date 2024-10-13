import { Router } from "express";
import {
  getFriendRequests,
  getFriendRequestCount,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
} from "../controllers/friend-requests";
import { authenticateToken } from "../middleware/auth";

const router: Router = Router();

router.get("/", authenticateToken, getFriendRequests);
router.get("/count", authenticateToken, getFriendRequestCount);
router.post("/", authenticateToken, sendFriendRequest);
router.patch("/accept", authenticateToken, acceptFriendRequest);
router.patch("/reject", authenticateToken, rejectFriendRequest);
router.delete("/cancel", authenticateToken, cancelFriendRequest);

export default router;
