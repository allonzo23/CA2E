import express from "express";
import { generateQr } from "../controllers/qrcodeController.js";
import { verifyToken } from "../middlewares/verifyTokens.js";

const router = express.Router();

// Générer QR code pour séance (formateur connecté)
router.get("/:idseance", verifyToken, generateQr);

export default router;

