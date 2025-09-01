import express from "express";
// import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {getall, getUserById, updateUser, deleteUser} from "../controllers/userController.js"

const router = express.Router();

// Admin: Get all users
router.get('/alluser',protect, authorize("admin"), getall);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
