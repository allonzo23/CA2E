import express from "express";
import { SuiviAccompagnementController } from "../controllers/SuiviAccompagnementController.js";

const router = express.Router();

router.get("/:idaccompagnement/suivis", SuiviAccompagnementController.getAccompagnementByFormateur);

// ➕ Ajouter un suivi
router.post("/:idaccompagnement", SuiviAccompagnementController.addSuiviAccompagnement);

// 📊 Obtenir la progression moyenne
router.get("/:idaccompagnement/progression", SuiviAccompagnementController.getProgressionMoyenne);

// ❌ Supprimer un suivi
router.delete("/:idsuivi", SuiviAccompagnementController.deleteSuivi);

export default router;