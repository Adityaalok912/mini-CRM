import express from "express";
// import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {getall} from "../controllers/userController.js"

const router = express.Router();

// Admin: Get all users
router.get('/alluser',protect, authorize("admin"), getall);
// router.get("/", protect, authorize("admin"), async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// });

export default router;
