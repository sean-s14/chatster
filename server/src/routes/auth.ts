import { Router } from "express";
import { signup, login, getNewAccessToken, logout } from "../controllers/auth";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/token", getNewAccessToken);
router.post("/logout", logout);

export default router;
