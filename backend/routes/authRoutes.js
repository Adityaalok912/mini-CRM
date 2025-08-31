import express from "express";
import { registerUser, loginUser, refreshToken, logoutUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", protect, authorize("admin"), registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

router.get('/me',protect, getMe);

export default router;
