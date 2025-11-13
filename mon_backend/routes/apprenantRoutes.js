// routes/apprenantRoutes.js
import express from "express";
import { getStatsApprenant, getApprenantsStatistiques, getFormationsByApprenant, getAll, getEvaluationsByApprenant, updateApprenant } from "../controllers/apprenantController.js";

const router = express.Router();

// GET /api/apprenants/:idapprenant/stats
router.get("/:idapprenant/stats", getStatsApprenant);
router.get("/", getAll);
router.get('/formations/:idformation/statistiques', getApprenantsStatistiques);
router.get("/:idapprenant/formations", getFormationsByApprenant);
router.get("/:idapprenant/evaluations", getEvaluationsByApprenant);
router.put("/update/:idutilisateur", updateApprenant);

export default router;
