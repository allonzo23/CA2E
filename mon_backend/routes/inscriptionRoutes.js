// routes/inscriptionRoutes.js
import express from "express";
import { verifyRole } from "../middlewares/auth.js";
import { verifyToken } from "../middlewares/verifyTokens.js";
import { InscriptionController } from "../controllers/InscriptionController.js";

const router = express.Router();

router.get("/pending", verifyToken, verifyRole(["administrateur"]), InscriptionController.getPending);
router.get("/apprenant/:idapprenant", InscriptionController.getByIdApprenant);
router.get("/formation/:idapprenant", InscriptionController.getFormationNotInscrit);
router.get("/confirmees", InscriptionController.getFormationsConfirmees);

router.get("/", InscriptionController.getAll);
router.get("/:id", InscriptionController.getById);
router.post("/", verifyToken, verifyRole(["apprenant"]), InscriptionController.create);


router.patch("/:id/statut", verifyToken, verifyRole(["administrateur"]), InscriptionController.updateStatut);

router.delete("/:id", InscriptionController.delete);

export default router;
