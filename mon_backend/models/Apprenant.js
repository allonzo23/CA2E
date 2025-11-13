// models/Apprenant.js
import { pool } from "../db.js";

export class Apprenant {
  static async create({ idutilisateur, filiere, niveau }) {
    const res = await pool.query(
      `INSERT INTO apprenant (idutilisateur, filiere, niveau)
       VALUES ($1, $2, $3) RETURNING *`,
      [idutilisateur, filiere, niveau]
    );
    return res.rows[0];
  }

  static async findAll() {
    const res = await pool.query("SELECT u.idutilisateur, u.nom, u.email, a.filiere, a.niveau FROM utilisateur u JOIN apprenant a ON u.idutilisateur = a.idutilisateur ORDER BY u.nom ASC");
    return res.rows;
  }


  static async findByUserId(idutilisateur) {
    const res = await pool.query("SELECT * FROM apprenant WHERE idutilisateur = $1", [idutilisateur]);
    return res.rows[0];
  }

  static async getStatsById(idapprenant) {
    const query = `
      SELECT 
        ua.nom AS nom_apprenant,
        ap.filiere,
        ap.niveau,
        COUNT(DISTINCT ins.idformation) AS nb_formations,
        COUNT(DISTINCT aco.idaccompagnement) AS nb_accompagnements
      FROM apprenant ap
      JOIN utilisateur ua ON ap.idutilisateur = ua.idutilisateur
      LEFT JOIN inscription ins 
             ON ins.idutilisateur = ap.idutilisateur AND ins.statut='validé'
      LEFT JOIN accompagnement aco 
             ON aco.idapprenant = ap.idutilisateur AND aco.datefin >= CURRENT_DATE
      WHERE ap.idutilisateur = $1
      GROUP BY ua.nom, ap.filiere, ap.niveau
    `;
    const { rows } = await pool.query(query, [idapprenant]);
    return rows[0] || null; // un seul résultat par apprenant
  }

  static async getFormationsApprenant(idapprenant) {
    try {
      const result = await pool.query(
        `SELECT f.idformation, f.titre, i.statut
        FROM inscription i
        JOIN formation f ON f.idformation = i.idformation
        WHERE i.idutilisateur = $1`,
        [idapprenant]
      );

      console.log("✅ Résultat brut :", result.rows);
      return result.rows; // ✅ Assure qu'on retourne un tableau
    } catch (error) {
      console.error("❌ Erreur dans getFormationsApprenant :", error);
      throw error; // relance l’erreur pour que le contrôleur la capture
    }
  }

  static async getEvaluationsApprenant(idapprenant) {
    try {
      const result = await pool.query(
        `SELECT 
        e.idevaluation,
        f.titre AS titre_formation,
        u.nom AS nom_formateur,
        e.note,
        e.commentaire,
        e.dateevaluation
      FROM evaluation e
      JOIN formation f ON e.idformation = f.idformation
      JOIN utilisateur u ON e.idformateur = u.idutilisateur
      WHERE e.idapprenant = $1
      ORDER BY e.dateevaluation DESC;`,
        [idapprenant]
      );
  
      console.log("✅ Résultat brut :", result.rows);
      return result.rows; // ✅ retourne un tableau des évaluations
    } catch (error) {
      console.error("❌ Erreur dans getEvaluationsApprenant :", error);
      throw error; // relance l’erreur pour que le contrôleur la capture
    }
  }
  

  // Afficher statistique apprenant
  static async getApprenantsStats (idformation) {
    try {
      const result = await pool.query(
        ` WITH taux AS (
          SELECT 
            p.idapprenant,
            s.idformation,
            COUNT(CASE WHEN p.est_present = true THEN 1 END)::float / COUNT(s.idseance) * 100 AS taux_presence
          FROM seance s
          JOIN presence p ON p.idseance = s.idseance
          WHERE s.idformation = $1
          GROUP BY p.idapprenant, s.idformation
        ),
        note AS (
          SELECT 
            e.idapprenant,
            e.idformation,
            AVG(e.note)::float / 20 * 100 AS progression_note
          FROM evaluation e
          WHERE e.idformation = $1
          GROUP BY e.idapprenant, e.idformation
        )
        SELECT 
          a.idutilisateur AS idapprenant,
          u.nom,
          u.email,
          f.titre AS formation,
          i.dateinscription,
          i.statut,
          ROUND(t.taux_presence::numeric, 2) AS taux_presence,
    ROUND(COALESCE(n.progression_note::numeric, 0), 2) AS progression
        FROM inscription i
        JOIN apprenant a ON a.idutilisateur = i.idutilisateur
        JOIN utilisateur u ON u.idutilisateur = a.idutilisateur
        JOIN formation f ON f.idformation = i.idformation
        LEFT JOIN taux t ON t.idapprenant = a.idutilisateur AND t.idformation = f.idformation
        LEFT JOIN note n ON n.idapprenant = a.idutilisateur AND n.idformation = f.idformation
        WHERE i.idformation = $1 AND i.statut = 'confirmé';`,
        [idformation]
      );
  
      console.log("✅ Résultat brut :", result.rows);
      return result.rows; // ✅ retourne un tableau des évaluations
    } catch (error) {
      console.error("❌ Erreur dans getEvaluationsApprenant :", error);
      throw error; // relance l’erreur pour que le contrôleur la capture
    }
  }


  // Récupérer les infos d'un apprenant par idutilisateur
  static async getById(idutilisateur) {
    const query = `
      SELECT u.idutilisateur, u.nom, u.email, a.filiere, a.niveau
      FROM utilisateur u
      JOIN apprenant a ON a.idutilisateur = u.idutilisateur
      WHERE u.idutilisateur = $1
    `;
    const result = await pool.query(query, [idutilisateur]);
    return result.rows[0];
  }

  // Mettre à jour les infos d'un apprenant
  static async update(idutilisateur, { nom, email, filiere, niveau }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Mise à jour table utilisateur
      const updateUtilisateur = `
        UPDATE utilisateur
        SET nom=$1, email=$2
        WHERE idutilisateur=$3
        RETURNING idutilisateur, nom, email
      `;
      const userResult = await client.query(updateUtilisateur, [nom, email, idutilisateur]);
      if (userResult.rows.length === 0) throw new Error("Utilisateur non trouvé");

      // Mise à jour table apprenant
      const updateApprenant = `
        UPDATE apprenant
        SET filiere=$1, niveau=$2
        WHERE idutilisateur=$3
        RETURNING filiere, niveau
      `;
      const apprenantResult = await client.query(updateApprenant, [filiere, niveau, idutilisateur]);
      if (apprenantResult.rows.length === 0) throw new Error("Apprenant non trouvé");

      await client.query("COMMIT");

      return {
        ...userResult.rows[0],
        ...apprenantResult.rows[0]
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export async function getApprenantByUtilisateur(idutilisateur) {
  const res = await pool.query(
    "SELECT idapprenant FROM apprenant WHERE idutilisateur=$1",
    [idutilisateur]
  );
  return res.rows[0];
}


