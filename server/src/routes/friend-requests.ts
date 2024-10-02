import { Router } from "express";
import {
  getAllSentFriendRequests,
  getAllReceivedFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/friend-requests";
import { authenticateToken } from "../middleware/auth";

const router: Router = Router();

router.get("/sent", authenticateToken, getAllSentFriendRequests);
router.get("/received", authenticateToken, getAllReceivedFriendRequests);
router.post("/", authenticateToken, sendFriendRequest);
router.patch("/accept", authenticateToken, acceptFriendRequest);
router.patch("/reject", authenticateToken, rejectFriendRequest);

export default router;
