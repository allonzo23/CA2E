// routes/UtilisateurRoutes.js
import express from "express";
import { UsersController } from "../controllers/UsersController.js";

const router = express.Router();

// CRUD utilisateurs
router.post("/", UsersController.create);
router.put("/:id", UsersController.update);
router.delete("/:id", UsersController.delete);
router.get("/role/:role", UsersController.listByRole);
router.get("/:id", UsersController.getById);

export default router;
