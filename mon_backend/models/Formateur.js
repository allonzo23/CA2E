// models/Apprenant.js
import { pool } from "../db.js";

export class Formateur {
  static async create({ idutilisateur, specialite}) {
    const res = await pool.query(
      `INSERT INTO formateur(idutilisateur, specialite)
       VALUES ($1, $2) RETURNING *`,
      [idutilisateur, specialite]
    );
    return res.rows[0];
  }

  static async findByUserId(idutilisateur) {
    const res = await pool.query("SELECT * FROM formateur WHERE idutilisateur = $1", [idutilisateur]);
    return res.rows[0];
  }
}
