import { SuiviAccompagnement } from "../models/SuiviAccompagnement.js";

export class SuiviAccompagnementController {
    static async getAccompagnementByFormateur(req, res) {
        try {
        const data = await SuiviAccompagnement.findSuivisByAccompagnement(req.params.idaccompagnement);
        if (!data) return res.status(404).json({ message: "Non trouvé" });
        res.json(data);
        } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
        }
    }

     // ➕ 2️⃣ Ajouter un nouveau suivi à un accompagnement
  static async addSuiviAccompagnement(req, res) {
    try {
      const { idaccompagnement } = req.params;
      const { commentaire, progression, remarque_formateur, created_by } = req.body;

      // Validation minimale
      if (!progression || !created_by) {
        return res.status(400).json({ message: "Les champs progression et created_by sont obligatoires" });
      }

      const newSuivi = await SuiviAccompagnement.insertSuiviAccompagnement(idaccompagnement, {
        commentaire,
        progression,
        remarque_formateur,
        created_by,
      });

      res.status(201).json({
        message: "Suivi ajouté avec succès",
        suivi: newSuivi,
      });
    } catch (err) {
      console.error("Erreur addSuiviAccompagnement :", err);
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  // 📊 3️⃣ Obtenir la progression moyenne d’un accompagnement
  static async getProgressionMoyenne(req, res) {
    try {
      const { idaccompagnement } = req.params;
      const moyenne = await SuiviAccompagnement.getMoyenneProgression(idaccompagnement);
      res.json({ idaccompagnement, progression_moyenne: moyenne });
    } catch (err) {
      console.error("Erreur getProgressionMoyenne :", err);
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  // ❌ 4️⃣ Supprimer un suivi
  static async deleteSuivi(req, res) {
    try {
      const { idsuivi } = req.params;
      const result = await SuiviAccompagnement.deleteSuivi(idsuivi);
      res.json(result);
    } catch (err) {
      console.error("Erreur deleteSuivi :", err);
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

}
