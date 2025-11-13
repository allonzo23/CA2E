// routes.js
import express from 'express';
import { SeanceController, PresenceController } from '../controllers/Presence_Seance_Controller.js';

const router = express.Router();

// Routes Seance
router.post('/seances', SeanceController.create);
router.get('/seances', SeanceController.getAll);
router.get('/seances/tous', SeanceController.getAllSeance);
router.get('/seances/:idformation', SeanceController.getByIdFormation);

// Routes Presence
router.post('/presences', PresenceController.create);
router.get('/presences/:id_seance', PresenceController.getBySeanceFalse);
router.get('/presences', PresenceController.getAllPresence);
router.get("/presences/seance/:idseance", PresenceController.getBySeance);
router.put('/presences/:id_presence', PresenceController.update);
 
export default router;
