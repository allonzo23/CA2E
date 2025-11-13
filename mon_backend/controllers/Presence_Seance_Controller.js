// controllers.js
import { Seance, Presence } from '../models/Presence_Seance.js';

export class SeanceController {
  static async create(req, res) {
    try {
      const { idformation, date_seance } = req.body;
      const seance = await Seance.create(idformation, date_seance);
      res.json(seance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const seances = await Seance.findAll();
      res.json(seances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // afficher le liste de seance
  static async getAllSeance(req, res) {
    try {
      const seances = await Seance.findAllSeance();
      res.json(seances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getByIdFormation(req, res) {
    try {
      const { idformation } = req.params;
      const seances = await Seance.findByIdFormation(idformation);
      res.json(seances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export class PresenceController {
  static async create(req, res) {
    try {
      const { idseance, idapprenant, est_present } = req.body;
      const presence = await Presence.create(idseance, idapprenant, est_present);
      res.json(presence);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getBySeanceFalse(req, res) {
    try {
      const { idseance } = req.params;
      const presences = await Presence.findBySeance(idseance);
      res.json(presences);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Récupérer les listes de présences 
  static async getAllPresence(req, res) {
    try {
      const presences = await Presence.getAllPresence();

      if (!presences || presences.length === 0) {
        return res.status(404).json({ message: "Aucune présence trouvée pour cette séance" });
      }

      res.json(presences);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des présences" });
    }
  }  
  
  
  // Récupérer les présences d'une séance
    static async getBySeance(req, res) {
      try {
        const { idseance } = req.params;
        const presences = await Presence.searchBySeance(idseance);
  
        if (!presences || presences.length === 0) {
          return res.status(404).json({ message: "Aucune présence trouvée pour cette séance" });
        }
  
        res.json(presences);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récupération des présences" });
      }
    }

  static async update(req, res) {
    try {
      const { idpresence } = req.params;
      const { est_present } = req.body;
      const presence = await Presence.updatePresence(idpresence, est_present);
      res.json(presence);
    } catch (err) {
      res.status(500).json({ error: err.message }); 
    }
  }
}
