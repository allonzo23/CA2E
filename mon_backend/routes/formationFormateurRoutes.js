import express from "express";
import { assigner, getFormateursDeFormation, getFormationsDuFormateur } from "../controllers/formationFormateurController.js";

const router = express.Router();

router.post("/", assigner);
router.get("/formation/:idformation", getFormateursDeFormation);
router.get("/formateur/:idformateur", getFormationsDuFormateur);

export default router;
