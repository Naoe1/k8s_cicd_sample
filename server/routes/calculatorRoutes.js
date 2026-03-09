import express from "express";
import { calculate } from "../controllers/calculatorController.js";

const router = express.Router();

// POST /api/calculate - Perform calculation
router.post("/", calculate);

export default router;