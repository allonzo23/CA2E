import express from "express";
import FormationController from "../controllers/FormationController.js";

const router = express.Router();
router.get("/:idformateur/formateur", FormationController.getFormationByIdFormateur);
router.get("/:idformateur/compter", FormationController.getCompterFormation);
router.get("/:idformateur/compterapprenant", FormationController.getCompterApprenant);
router.get("/:idformateur/compterapprenantevaluation", FormationController.getCompterApprenantEvaluation);

router.get("/", FormationController.getAll);
router.get("/tous", FormationController.getTous);
router.get("/:id", FormationController.getById);
router.post("/", FormationController.createFormation);
router.put("/:id", FormationController.update);
router.delete("/:id", FormationController.delete);

export default router;




/*
import express from "express";
import { FormationController } from "../controllers/FormationController.js";

const router = express.Router();

router.post("/", FormationController.createFormationController);

export default router;
*/