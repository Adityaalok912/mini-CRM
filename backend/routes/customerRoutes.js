import express from "express";
import { getCustomers, createCustomer, updateCustomer, getCustomersCount, addNote, getCustomerById, deleteCustomer } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCustomers);
router.get("/count", getCustomersCount);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.patch("/:id", updateCustomer);
router.post("/:id/notes", addNote);

router.delete("/:id", deleteCustomer);

export default router;
