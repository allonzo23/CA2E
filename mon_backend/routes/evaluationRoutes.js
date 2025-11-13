// routes/evaluationRoutes.js
import express from "express";
import { EvaluationController } from "../controllers/EvaluationController.js";

const router = express.Router();

router.get("/apprenant/:id", EvaluationController.getByIdApprenant);
router.get("/:idformateur/formateur", EvaluationController.getEvaluationByFormateur);

router.get("/", EvaluationController.getAll);
router.get("/search", EvaluationController.search);
router.get("/:id", EvaluationController.getById);
router.post("/", EvaluationController.create);
router.put("/:id", EvaluationController.update);
router.delete("/:id", EvaluationController.delete);

export default router;
