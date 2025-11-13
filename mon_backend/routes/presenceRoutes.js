import express from "express";
import { validatePresence } from "../controllers/presenceController.js";
import { verifyToken } from "../middlewares/verifyTokens.js";

const router = express.Router();

// Validation de présence par apprenant connecté
router.post("/validate", verifyToken, validatePresence);

export default router;
