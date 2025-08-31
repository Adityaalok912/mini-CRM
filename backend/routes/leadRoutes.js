import express from "express";
import { getLeads, createLead, updateLead, deleteLead, convertLead } from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getLeads);
router.post("/", createLead);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/convert", convertLead);

export default router;
