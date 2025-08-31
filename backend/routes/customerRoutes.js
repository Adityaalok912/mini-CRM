import express from "express";
import { getCustomers, createCustomer, updateCustomer, addNote } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCustomers);
router.post("/", createCustomer);
router.patch("/:id", updateCustomer);
router.post("/:id/notes", addNote);

export default router;
