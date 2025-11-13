// models/Apprenant.js
import { pool } from "../db.js";

export class Administrateur {
  static async create({ idutilisateur, poste}) {
    const res = await pool.query(
      `INSERT INTO administrateur (idutilisateur, poste)
       VALUES ($1, $2) RETURNING *`,
      [idutilisateur, poste]
    );
    return res.rows[0];
  }

  static async findByUserId(idutilisateur) {
    const res = await pool.query("SELECT * FROM administrateur WHERE idutilisateur = $1", [idutilisateur]);
    return res.rows[0];
  }
}
