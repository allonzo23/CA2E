// controllers/AccompagnementController.js
import { Accompagnement } from "../models/Accompagnement.js";

export class AccompagnementController {
  static async getAll(req, res) {
    try {
      const data = await Accompagnement.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  // affichage sans id
  static async getAccompagnement(req, res) {
    try {
      const data = await Accompagnement.findAccompagnement();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async getAccompagnementByFormateur(req, res) {
    try {
      const data = await Accompagnement.findAccompagnementByFormateur(req.params.idformateur);
      if (!data) return res.status(404).json({ message: "Non trouvé" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const data = await Accompagnement.getById(req.params.id);
      if (!data) return res.status(404).json({ message: "Non trouvé" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newData = await Accompagnement.create(req.body);
      res.status(201).json({ message: "Accompagnement ajouté", data: newData });
    } catch (err) {
      res.status(400).json({ message: "Erreur création", error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await Accompagnement.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Non trouvé" });
      res.json({ message: "Mis à jour", data: updated });
    } catch (err) {
      res.status(400).json({ message: "Erreur modification", error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Accompagnement.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Non trouvé" });
      res.json({ message: "Supprimé", data: deleted });
    } catch (err) {
      res.status(500).json({ message: "Erreur suppression", error: err.message });
    }
  }
}
