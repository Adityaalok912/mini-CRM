import express from "express";
import { getTasks, createTask, getOverdueTasks, updateTask, deleteTask, getOpenTasksCount } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/open-count", getOpenTasksCount);
router.get("/overdue",  getOverdueTasks);

export default router;
