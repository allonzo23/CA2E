// models/Inscription.js
import pool from "../db.js";

export class Inscription {
  constructor({ idinscription, idutilisateur, idformation, dateinscription, statut }) {
    this.idinscription = idinscription;
    this.idutilisateur = idutilisateur;
    this.idformation = idformation;
    this.dateinscription = dateinscription;
    this.statut = statut;
  }

  static async getAll() {
    const query = `
      SELECT i.*, u.nom AS nom_apprenant, f.titre AS titre_formation
      FROM inscription i
      JOIN apprenant a ON i.idutilisateur = a.idutilisateur
      JOIN utilisateur u ON a.idutilisateur = u.idutilisateur
      JOIN formation f ON i.idformation = f.idformation
      ORDER BY i.idinscription ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT i.*, u.nom AS nom_apprenant, f.titre AS titre_formation
      FROM inscription i
      JOIN apprenant a ON i.idutilisateur = a.idutilisateur
      JOIN utilisateur u ON a.idutilisateur = u.idutilisateur
      JOIN formation f ON i.idformation = f.idformation
      WHERE i.idinscription = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async getByIdApprenant(idapprenant) {
    const query = `
      SELECT i.*, u.nom AS nom_apprenant, f.titre AS titre_formation
      FROM inscription i
      JOIN apprenant a ON i.idutilisateur = a.idutilisateur
      JOIN utilisateur u ON a.idutilisateur = u.idutilisateur
      JOIN formation f ON i.idformation = f.idformation
      WHERE a.idutilisateur = $1
    `;
    const { rows } = await pool.query(query, [idapprenant]);
    return rows[0] || null;
  }

  // Afficher le formation qui ne s'inscrit pas par un user
  static async getFormationNotInscrit (idapprenant) {
    const query = `
    SELECT f.idformation, f.titre
    FROM formation f
    LEFT JOIN inscription i
    ON f.idformation = i.idformation AND i.idutilisateur = $1
    WHERE i.idformation IS NULL;
    `;
    const { rows } = await pool.query(query, [idapprenant]);
    return rows;
  }

  // 🟩 Créer une nouvelle inscription avec statut "en attente"
  static async create({ idutilisateur, idformation, statut = "en attente" }) {
    const query = `
      INSERT INTO inscription (idutilisateur, idformation, statut)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [idutilisateur, idformation, statut]);
    return rows[0];
  }
  

    // 🟩 Récupérer toutes les inscriptions en attente
    static async getPending() {
      const query = `
        SELECT i.idinscription, u.nom AS nom_apprenant, f.titre AS titre_formation, i.statut, i.dateinscription
        FROM inscription i
        JOIN utilisateur u ON i.idutilisateur = u.idutilisateur
        JOIN formation f ON i.idformation = f.idformation
        WHERE i.statut = 'en attente'
        ORDER BY i.dateinscription DESC
      `;
      const { rows } = await pool.query(query);
      return rows;
    }

    // recuperer toutes les inscriptions validé
    static async getFormationsConfirmees() {
      const query = `
        SELECT
          f.idformation,
          f.titre,
          COUNT(i.idinscription) AS total_inscrits,
          json_agg(
            json_build_object(
              'idapprenant', a.idutilisateur,
              'nom', u.nom
            )
          ) AS apprenants
        FROM formation f
        JOIN inscription i ON f.idformation = i.idformation
        JOIN apprenant a ON i.idutilisateur = a.idutilisateur
        JOIN utilisateur u ON a.idutilisateur = u.idutilisateur
        WHERE i.statut = 'confirmé'
        GROUP BY f.idformation, f.titre
        ORDER BY f.titre;
      `;
  
      const { rows } = await pool.query(query);
      return rows;
    }  

  
  // 🟩 Mettre à jour le statut d’une inscription
  static async updateStatut(idinscription, statut) {
    const query = `
      UPDATE inscription
      SET statut = $1
      WHERE idinscription = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [statut, idinscription]);
    return rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM inscription WHERE idinscription = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }
}
