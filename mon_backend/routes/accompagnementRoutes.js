// routes/accompagnementRoutes.js
import express from "express";
import { AccompagnementController } from "../controllers/AccompagnementController.js";

const router = express.Router();

router.get("/", AccompagnementController.getAll);
router.get("/global", AccompagnementController.getAccompagnement);
router.get("/:idformateur/formateur", AccompagnementController.getAccompagnementByFormateur);
router.get("/:id", AccompagnementController.getById);
router.post("/", AccompagnementController.create);
router.put("/:id", AccompagnementController.update);
router.delete("/:id", AccompagnementController.delete);

export default router;
