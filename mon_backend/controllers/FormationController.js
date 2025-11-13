import pool from "../db.js";
import Formation from "../models/Formation.js";
import { assignFormateurToFormation } from "../models/formationFormateurModel.js";

class FormationController {
  static async getAll(req, res) {
    try {
      const formations = await Formation.getAll();
      res.status(200).json(formations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  // Récupérer toutes les formations pour admin
  // ✅ Retourne toutes les formations sans utiliser d'ID
  static async getTous(req, res) {
    try {
      // Affiche ce que le backend reçoit, pour debug
      console.log("params:", req.params);
      console.log("query:", req.query);

      // On ignore totalement req.params ou req.query
      const formations = await Formation.getTous();

      // Retour JSON
      return res.status(200).json(formations);
    } catch (error) {
      console.error("Erreur getTous:", error); // log complet pour debug
      return res.status(500).json({
        message: "Erreur serveur lors de la récupération des formations",
        error: error.message,
      });
    }
  }
  
  

  static async getById(req, res) {
    try {
      const formation = await Formation.getById(req.params.id);
      if (!formation) return res.status(404).json({ message: "Formation introuvable" });
      res.status(200).json(formation);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  // selection de compter formation par idformateur
  static async getCompterFormation(req, res) {
    try {
      const formation = await Formation.getCompterFormation(req.params.idformateur);
      if (!formation) return res.status(404).json({ message: "Formation introuvable" });
      res.status(200).json(formation);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }


  // selection de compter Apprenant par idformateur groupé par formation
  static async getCompterApprenant(req, res) {
    try {
      const formation = await Formation.getCompterApprenant(req.params.idformateur);
      if (!formation) return res.status(404).json({ message: "Formation introuvable" });
      res.status(200).json(formation);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }


  // selection de compter Apprenant qui a été fait evaluer par idformateur groupé par formation
  static async getCompterApprenantEvaluation(req, res) {
    try {
      const formation = await Formation.getCompterApprenantEvaluation(req.params.idformateur);
      if (!formation) return res.status(404).json({ message: "Formation introuvable" });
      res.status(200).json(formation);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  // selection de formation par idformateur
  static async getFormationByIdFormateur(req, res) {
    try {
      const formation = await Formation.getFormationByIdFormateur(req.params.id);
      if (!formation) return res.status(404).json({ message: "Formation introuvable" });
      res.status(200).json(formation);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  /**
   * Crée une nouvelle formation et la lie automatiquement à un formateur.
   */
  static async createFormation(req, res) {
    const client = await pool.connect();

    try {
      const { titre, description, duree, datedebut, datefin, idformateur } = req.body;

      if (!idformateur) {
        return res.status(400).json({ message: "Le champ idformateur est requis." });
      }

      await client.query("BEGIN");

      // 1️⃣ Création de la formation
      const formation = await Formation.create({
        titre,
        description,
        duree: duree?.days ?? duree, // gère le format { days: n } du front
        datedebut,
        datefin,
      });

      // 2️⃣ Liaison automatique dans formation_formateur
      await assignFormateurToFormation(formation.idformation, idformateur);

      await client.query("COMMIT");

      return res.status(201).json(formation);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ Erreur lors de la création de la formation :", err);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    } finally {
      client.release();
    }
  }

  static async update(req, res) {
    try {
      const updated = await Formation.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Formation non trouvée" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erreur mise à jour", error });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Formation.delete(req.params.id);
  
      if (!deleted) {
        return res.status(404).json({ message: "Formation non trouvée" });
      }
  
      return res.status(200).json({ message: "Formation supprimée avec succès" });
    } catch (error) {
      // 🧩 Cas particulier : erreur clé étrangère (liée à des séances)
      if (error.code === "23503") {
        return res.status(400).json({
          message:
            "Impossible de supprimer cette formation : elle est encore liée à des séances.",
        });
      }
  
      console.error("❌ Erreur suppression formation :", error);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de la suppression", error });
    }
  }
  
}

export default FormationController;



/*
import dotenv from "dotenv";
import { Formation } from "../models/Formation.js";



export class FormationController {
    static async createFormationController(req, res) {
      try {
        const { titre, description, duree, datedebut, datefin } = req.body;
        const reponse = await Formation.create({ titre, description, duree, datedebut, datefin });
        return res.status(201).json({ message: "Formation créé", formation: reponse });
    } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
        }
    }
}
*/