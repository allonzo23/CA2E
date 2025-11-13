// controllers/EvaluationController.js
import { Evaluation } from "../models/Evaluation.js";

export class EvaluationController {
  static async getAll(req, res) {
    try {
      const data = await Evaluation.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async search(req, res) {
    try {
      const { keyword, idapprenant, idformateur, idformation, noteMin, noteMax } = req.query;

      const result = await Evaluation.search({
        keyword,
        idapprenant,
        idformateur,
        idformation,
        noteMin,
        noteMax
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Erreur recherche", error: err.message });
    }
  }

  static async getByIdApprenant(req, res) {
    try {
      const data = await Evaluation.getByIdApprenant(req.params.idapprenant);
      if (!data) return res.status(404).json({ message: "Non trouvé" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }


  static async getEvaluationByFormateur(req, res) {
    try {
      const data = await Evaluation.findEvaluationByFormateur(req.params.idformateur);
      if (!data) return res.status(404).json({ message: "Non trouvé" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }


  static async getById(req, res) {
    try {
      const data = await Evaluation.getById(req.params.id);
      if (!data) return res.status(404).json({ message: "Non trouvé" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newData = await Evaluation.create(req.body);
      res.status(201).json({ message: "Évaluation créée", data: newData });
    } catch (err) {
      res.status(400).json({ message: "Erreur création", error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await Evaluation.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Non trouvé" });
      res.json({ message: "Mis à jour", data: updated });
    } catch (err) {
      res.status(400).json({ message: "Erreur modification", error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Evaluation.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Non trouvé" });
      res.json({ message: "Supprimé", data: deleted });
    } catch (err) {
      res.status(500).json({ message: "Erreur suppression", error: err.message });
    }
  }
}
