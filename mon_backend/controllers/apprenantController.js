// controllers/apprenantController.js
import{ Apprenant } from "../models/Apprenant.js";

export const getStatsApprenant = async (req, res) => {
  try {
    const idapprenant = parseInt(req.params.idapprenant, 10);

    if (isNaN(idapprenant)) {
      return res.status(400).json({ message: "L'idapprenant doit être un nombre valide" });
    }

    const stats = await Apprenant.getStatsById(idapprenant);

    if (!stats) {
      return res.status(404).json({ message: "Aucun apprenant trouvé" });
    }

    res.json(stats);
  } catch (error) {
    console.error("Erreur getStatsApprenant:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const getApprenantsStatistiques = async (req, res) => {
  try {
    const idformation = parseInt(req.params.idformation, 10);

    if (isNaN(idformation)) {
      return res.status(400).json({ message: "L'idformation doit être un nombre valide" });
    }

    const statistiques = await Apprenant.getApprenantsStats(idformation);

    if (!statistiques) {
      return res.status(404).json({ message: "Aucun donné trouvé" });
    }

    res.json(statistiques);
  } catch (error) {
    console.error("Erreur getApprenantStatistique:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//recuperer les apprenants
export const getAll = async (req, res) => {
  try {
    const rows = await Apprenant.findAll();
    res.json(rows);
  } catch (error) {
    console.error("Erreur du serveur :", error);
    res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
  }
};


export const getFormationsByApprenant = async (req, res) => {
  try {
    const idapprenant = parseInt(req.params.idapprenant, 10);

    if (isNaN(idapprenant)) {
      return res.status(400).json({ message: "L'idapprenant doit être un nombre valide" });
    }

    const rows = await Apprenant.getFormationsApprenant(idapprenant);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Aucune formation trouvée pour cet apprenant." });
    }

    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
  }
};

// 📌 Récupérer les évaluations d’un apprenant
export const getEvaluationsByApprenant = async (req, res) => {
  try {
    const idapprenant = parseInt(req.params.idapprenant, 10);

    if (isNaN(idapprenant)) {
      return res.status(400).json({ message: "L'idapprenant doit être un nombre valide" });
    }

    const evaluations = await Apprenant.getEvaluationsApprenant(idapprenant);

    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ message: "Aucune évaluation trouvée pour cet apprenant." });
    }

    res.json(evaluations);
  } catch (error) {
    console.error("Erreur lors de la récupération des évaluations :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// Modifier un apprenant
export const updateApprenant = async (req, res) => {
  try {
    const idutilisateur = parseInt(req.params.idutilisateur, 10);
    if (isNaN(idutilisateur)) return res.status(400).json({ message: "ID invalide" });

    const { nom, email, filiere, niveau } = req.body;
    if (!nom || !email || !filiere || !niveau) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const updatedUser = await Apprenant.update(idutilisateur, { nom, email, filiere, niveau });
    res.json({ message: "Apprenant mis à jour avec succès", updatedUser });
  } catch (error) {
    console.error("Erreur updateApprenant :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
