// models/Utilisateur.js
import { pool } from "../db.js";
import bcrypt from "bcrypt";

export class UsersModel {
  static async create({ nom, email, motdepasse, idrole }) {
    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    const res = await pool.query(
      `INSERT INTO utilisateur (nom, email, motdepasse, idrole)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nom, email, hashedPassword, idrole]
    );
    return res.rows[0];
  }

  static async update(idutilisateur, { nom, email, motdepasse }) {
    let query = "UPDATE utilisateur SET nom=$1, email=$2";
    const params = [nom, email];
    if (motdepasse) {
      const hashedPassword = await bcrypt.hash(motdepasse, 10);
      query += ", motdepasse=$3";
      params.push(hashedPassword);
    }
    query += " WHERE idutilisateur=$" + (params.length + 1) + " RETURNING *";
    params.push(idutilisateur);
    const res = await pool.query(query, params);
    return res.rows[0];
  }

  static async delete(idutilisateur) {
    await pool.query("DELETE FROM utilisateur WHERE idutilisateur=$1", [idutilisateur]);
    return true;
  }

  static async findAllByRole(idrole) {
    const res = await pool.query(
      `SELECT u.*, a.filiere, a.niveau, f.specialite, ad.poste
       FROM utilisateur u
       LEFT JOIN apprenant a ON u.idutilisateur=a.idutilisateur
       LEFT JOIN formateur f ON u.idutilisateur=f.idutilisateur
       LEFT JOIN administrateur ad ON u.idutilisateur=ad.idutilisateur
       WHERE u.idrole=$1`,
      [idrole]
    );
    return res.rows;
  }

  static async findById(idutilisateur) {
    const res = await pool.query(
      `SELECT u.*, a.filiere, a.niveau, f.specialite, ad.poste
       FROM utilisateur u
       LEFT JOIN apprenant a ON u.idutilisateur=a.idutilisateur
       LEFT JOIN formateur f ON u.idutilisateur=f.idutilisateur
       LEFT JOIN administrateur ad ON u.idutilisateur=ad.idutilisateur
       WHERE u.idutilisateur=$1`,
      [idutilisateur]
    );
    return res.rows[0];
  }
}
