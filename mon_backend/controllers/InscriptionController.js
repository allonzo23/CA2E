// controllers/InscriptionController.js
import { Inscription } from "../models/Inscription.js";
import pool from "../db.js";

export class InscriptionController {
  static async getAll(req, res) {
    try {
      const inscriptions = await Inscription.getAll();
      return res.json(inscriptions);
    } catch (err) {
      console.error("Erreur getAll:", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const inscription = await Inscription.getById(id);
      if (!inscription) return res.status(404).json({ message: "Inscription non trouvée" });
      return res.json(inscription);
    } catch (err) {
      console.error("Erreur getById:", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async getByIdApprenant(req, res) {
    try {
      const idapprenant = parseInt(req.params.idapprenant, 10); // ✅ nom correct
  
      if (isNaN(idapprenant)) {
        return res.status(400).json({ message: "L'idapprenant doit être un nombre valide" });
      }
  
      const inscriptions = await Inscription.getByIdApprenant(idapprenant);
  
      if (!inscriptions || inscriptions.length === 0) {
        return res.status(404).json({ message: "Aucune inscription trouvée pour cet apprenant" });
      }
  
      return res.json(inscriptions);
    } catch (err) {
      console.error("Erreur getByIdApprenant:", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
  

  static async getFormationNotInscrit(req, res) {
    try {
      const idapprenant = parseInt(req.params.idapprenant, 10); // ✅ nom correct
  
      if (isNaN(idapprenant)) {
        return res.status(400).json({ message: "L'idapprenant doit être un nombre valide" });
      }
  
      const inscriptions = await Inscription.getFormationNotInscrit(idapprenant);
  
      if (!inscriptions || inscriptions.length === 0) {
        return res.status(404).json({ message: "Aucune formation disponible" });
      }
  
      return res.json(inscriptions);
    } catch (err) {
      console.error("Erreur getByIdApprenant:", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const { idutilisateur, idformation, statut } = req.body;
      if (!idutilisateur || !idformation)
        return res.status(400).json({ message: "Champs obligatoires manquants" });

      // Vérifier si l'utilisateur existe dans apprenant
      const userCheck = await pool.query(
        "SELECT * FROM apprenant WHERE idutilisateur = $1",
        [idutilisateur]
      );
      if (userCheck.rows.length === 0)
        return res.status(404).json({ message: "Apprenant inexistant" });

      // Vérifier si la formation existe
      const formationCheck = await pool.query(
        "SELECT * FROM formation WHERE idformation = $1",
        [idformation]
      );
      if (formationCheck.rows.length === 0)
        return res.status(404).json({ message: "Formation inexistante" });

      // Vérifier si l'apprenant est déjà inscrit à la formation
      const existingCheck = await pool.query(
        "SELECT * FROM inscription WHERE idutilisateur = $1 AND idformation = $2",
        [idutilisateur, idformation]
      );
      if (existingCheck.rows.length > 0)
        return res.status(400).json({ message: "Cet apprenant est déjà inscrit à cette formation" });

      // Insérer l'inscription
      const created = await Inscription.create({ idutilisateur, idformation, statut });
      return res.status(201).json({ message: "Inscription réussie", inscription: created });
    } catch (err) {
      console.error("Erreur create:", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

    // 🟩 Récupérer les inscriptions en attente
    static async getPending(req, res) {
      try {
        const inscriptions = await Inscription.getPending();
        return res.json(inscriptions);
      } catch (err) {
        console.error("Erreur getPending:", err);
        return res
          .status(500)
          .json({ message: "Erreur serveur", error: err.message });
      }
    }

    // 🟩 Récupérer les inscriptions validé
    static async getFormationsConfirmees(req, res) {
      try {
        const formations = await Inscription.getFormationsConfirmees();
        res.json(formations);
      } catch (error) {
        console.error("Erreur dans getFormationsConfirmees:", error);
        res.status(500).json({ message: "Erreur serveur" });
      }
    }

  /// 🟩 Mettre à jour le statut d'une inscription
  static async updateStatut(req, res) {
    try {
      const { id } = req.params;
      const { statut } = req.body;

      if (!["confirmé", "refusé"].includes(statut)) {
        return res.status(400).json({
          message: "Statut invalide. Utilisez 'confirmée' ou 'refusé'.",
        });
      }

      const updated = await Inscription.updateStatut(id, statut);
      if (!updated)
        return res.status(404).json({ message: "Inscription non trouvée" });

      return res.json({
        message: `Statut mis à jour en '${statut}'`,
        inscription: updated,
      });
    } catch (err) {
      console.error("Erreur updateStatut:", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur", error: err.message });
    }
  }
  

  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await Inscription.delete(id);
      if (!deleted) return res.status(404).json({ message: "Inscription non trouvée" });
      return res.json({ message: "Inscription supprimée", inscription: deleted });
    } catch (err) {
      console.error("Erreur delete:", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
}
