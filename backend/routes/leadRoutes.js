import express from "express";
import { getLeads, createLead, updateLead,getLeadsStatusCount, deleteLead, convertLead, getLeadById, getLeadsStats } from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getLeads);
router.get("/stats", getLeadsStats);
router.get("/status-count", getLeadsStatusCount);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/convert", convertLead);

export default router;
