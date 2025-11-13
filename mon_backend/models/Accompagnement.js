// models/Accompagnement.js
// models/Accompagnement.js
import pool from "../db.js";

export class Accompagnement {
  static async getAll() {
    const result = await pool.query(`
    SELECT a.*, ap.nom AS nom_apprenant, f.nom AS nom_formateur
    FROM accompagnement a
    JOIN utilisateur ap ON a.idapprenant = ap.idutilisateur
    JOIN utilisateur f ON a.idformateur = f.idutilisateur
    ORDER BY a.idaccompagnement ASC
    `);
    return result.rows;
  }

  // affichage sans id
  static async findAccompagnement() {
    const result = await pool.query(`
    SELECT 
  a.idaccompagnement,
  u.nom AS nom_apprenant,
  u.email AS email_apprenant,
  f.titre AS formation,
  a.type,
  a.objectifs,
  a.datedebut,
  a.datefin,
  a.etat,
  COALESCE(ROUND(AVG(s.progression)::numeric, 2), 0) AS progression
FROM accompagnement a
JOIN apprenant ap ON a.idapprenant = ap.idutilisateur
JOIN utilisateur u ON ap.idutilisateur = u.idutilisateur
JOIN formation f ON a.idformation = f.idformation
LEFT JOIN suivi_accompagnement s ON s.idaccompagnement = a.idaccompagnement
GROUP BY a.idaccompagnement, u.nom, u.email, f.titre, a.type, a.objectifs, a.datedebut, a.datefin, a.etat
ORDER BY a.datedebut DESC
    `,
    );
    return result.rows;
  }


  static async findAccompagnementByFormateur(idformateur) {
    const result = await pool.query(`
    SELECT 
  a.idaccompagnement,
  u.nom AS nom_apprenant,
  u.email AS email_apprenant,
  f.titre AS formation,
  a.type,
  a.objectifs,
  a.datedebut,
  a.datefin,
  a.etat,
  COALESCE(ROUND(AVG(s.progression)::numeric, 2), 0) AS progression
FROM accompagnement a
JOIN apprenant ap ON a.idapprenant = ap.idutilisateur
JOIN utilisateur u ON ap.idutilisateur = u.idutilisateur
JOIN formation f ON a.idformation = f.idformation
LEFT JOIN suivi_accompagnement s ON s.idaccompagnement = a.idaccompagnement
WHERE a.idformateur = $1
GROUP BY a.idaccompagnement, u.nom, u.email, f.titre, a.type, a.objectifs, a.datedebut, a.datefin, a.etat
ORDER BY a.datedebut DESC
    `,
    [idformateur]
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      `
      SELECT a.*, ap.nom AS nom_apprenant, f.nom AS nom_formateur
    FROM accompagnement a
    JOIN utilisateur ap ON a.idapprenant = ap.idutilisateur
    JOIN utilisateur f ON a.idformateur = f.idutilisateur
      WHERE a.idaccompagnement = $1
      `,
      [id]
    );
    return result.rows[0];
  }

  static async create({ idapprenant, idformateur, type, objectifs, datedebut, datefin }) {
    // ✅ Vérifier que les deux clés étrangères existent
    const apprenant = await pool.query(
      "SELECT idutilisateur FROM apprenant WHERE idutilisateur = $1",
      [idapprenant]
    );
    if (apprenant.rowCount === 0) {
      throw new Error("L'apprenant spécifié n'existe pas");
    }

    const formateur = await pool.query(
      "SELECT idutilisateur FROM formateur WHERE idutilisateur = $1",
      [idformateur]
    );
    if (formateur.rowCount === 0) {
      throw new Error("Le formateur spécifié n'existe pas");
    }

    // ✅ Insertion
    const result = await pool.query(
      `
      INSERT INTO accompagnement (idapprenant, idformateur, type, objectifs, datedebut, datefin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [idapprenant, idformateur, type, objectifs, datedebut, datefin]
    );

    return result.rows[0];
  }

  static async update(id, { idformateur, type, objectifs, datedebut, datefin }) {
    const result = await pool.query(
      `
      UPDATE accompagnement
      SET idformateur = $1, type = $2, objectifs = $3, datedebut = $4, datefin = $5
      WHERE idaccompagnement = $6
      RETURNING *
      `,
      [idformateur, type, objectifs, datedebut, datefin, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM accompagnement WHERE idaccompagnement = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}





