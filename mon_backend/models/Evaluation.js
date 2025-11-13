// models/Evaluation.js
import pool from "../db.js";

export class Evaluation {
  static async getAll() {
    const result = await pool.query(`
    SELECT e.*, 
    ap.nom AS nom_apprenant,
    f.nom AS nom_formateur,
    fo.titre AS titre_formation
FROM evaluation e
JOIN utilisateur ap ON e.idapprenant = ap.idutilisateur
JOIN utilisateur f ON e.idformateur = f.idutilisateur
JOIN formation fo ON e.idformation = fo.idformation
ORDER BY e.idevaluation ASC
    `);
    return result.rows;
  }

  static async search({ keyword, idapprenant, idformateur, idformation, noteMin, noteMax }) {
    let query = `
      SELECT e.*, ap.nom AS nom_apprenant, f.nom AS nom_formateur, fo.titre AS titre_formation
      FROM evaluation e
      JOIN utilisateur ap ON e.idapprenant = ap.idutilisateur
      JOIN utilisateur f ON e.idformateur = f.idutilisateur
      JOIN formation fo ON e.idformation = fo.idformation
      WHERE 1=1
    `;
    const params = [];
    let i = 1;

    if (keyword) {
      query += ` AND (LOWER(ap.nom) LIKE LOWER($${i}) OR LOWER(f.nom) LIKE LOWER($${i + 1}) OR LOWER(fo.titre) LIKE LOWER($${i + 2}) OR LOWER(e.commentaire) LIKE LOWER($${i + 3}))`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      i += 4;
    }

    if (idapprenant) {
      query += ` AND e.idapprenant = $${i++}`;
      params.push(idapprenant);
    }

    if (idformateur) {
      query += ` AND e.idformateur = $${i++}`;
      params.push(idformateur);
    }

    if (idformation) {
      query += ` AND e.idformation = $${i++}`;
      params.push(idformation);
    }

    if (noteMin) {
      query += ` AND e.note >= $${i++}`;
      params.push(noteMin);
    }

    if (noteMax) {
      query += ` AND e.note <= $${i++}`;
      params.push(noteMax);
    }

    query += " ORDER BY e.dateevaluation DESC";
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getByIdApprenant(idapprenant) {
    const result = await pool.query(
      `SELECT e.idevaluation, e.note, e.commentaire, e.dateevaluation,
              f.titre AS titre_formation,
              u.nom AS nom_formateur
       FROM evaluation e
       JOIN formation f ON e.idformation = f.idformation
       JOIN formateur fr ON e.idformateur = fr.idutilisateur
       JOIN utilisateur u ON fr.idutilisateur = u.idutilisateur
       WHERE e.idapprenant = $1
       ORDER BY e.dateevaluation DESC`, [idapprenant]);
    return result.rows;
  }

  static async findEvaluationByFormateur(idformateur) {
    const result = await pool.query(
      `SELECT
      e.idevaluation,
      u.nom AS nom_apprenant,
      u.email AS email_apprenant,
      f.titre AS formation,
      e.note
  FROM evaluation e
  JOIN formation f ON e.idformation = f.idformation
  JOIN formation_formateur ff ON ff.idformation = f.idformation
  JOIN formateur fo ON ff.idformateur = fo.idutilisateur
  JOIN apprenant a ON e.idapprenant = a.idutilisateur
  JOIN utilisateur u ON a.idutilisateur = u.idutilisateur
  WHERE fo.idutilisateur = $1
  ORDER BY f.titre, u.nom`, [idformateur]);
    return result.rows;
  }


  static async getById(id) {
    const result = await pool.query(`
    SELECT e.*, 
    ap.nom AS nom_apprenant,
    f.nom AS nom_formateur,
    fo.titre AS titre_formation
FROM evaluation e
JOIN utilisateur ap ON e.idapprenant = ap.idutilisateur
JOIN utilisateur f ON e.idformateur = f.idutilisateur
JOIN formation fo ON e.idformation = fo.idformation
      WHERE e.idevaluation = $1
    `, [id]);
    return result.rows[0];
  }

  static async create({ idapprenant, idformateur, idformation, note, commentaire }) {
    // Vérifier existence des clés étrangères
    const apprenant = await pool.query("SELECT idutilisateur FROM apprenant WHERE idutilisateur = $1", [idapprenant]);
    if (apprenant.rowCount === 0) throw new Error("Apprenant inexistant");

    const formateur = await pool.query("SELECT idutilisateur FROM formateur WHERE idutilisateur = $1", [idformateur]);
    if (formateur.rowCount === 0) throw new Error("Formateur inexistant");

    const formation = await pool.query("SELECT idformation FROM formation WHERE idformation = $1", [idformation]);
    if (formation.rowCount === 0) throw new Error("Formation inexistante");

    const result = await pool.query(`
      INSERT INTO evaluation (idapprenant, idformateur, idformation, note, commentaire)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [idapprenant, idformateur, idformation, note, commentaire]);

    return result.rows[0];
  }

  static async update(id, { note, commentaire }) {
    const result = await pool.query(`
      UPDATE evaluation
      SET note = $1, commentaire = $2
      WHERE idevaluation = $3
      RETURNING *
    `, [note, commentaire, id]);

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(`
      DELETE FROM evaluation
      WHERE idevaluation = $1
      RETURNING *
    `, [id]);
    return result.rows[0];
  }
}
