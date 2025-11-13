// models/Utilisateur.js
import { pool } from "../db.js";

export class Utilisateur {
  static async create({ nom, email, motdepasse, idrole }) {
    const res = await pool.query(
      `INSERT INTO utilisateur (nom, email, motdepasse, idrole)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [nom, email, motdepasse, idrole]
    );
    return res.rows[0];
  }

  static async findByEmail(email) {
    const res = await pool.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
    return res.rows[0] || null;
  }

  static async findWithRoleByEmail(email) {
    const res = await pool.query(
      `SELECT u.*, r.nomrole FROM utilisateur u JOIN role r ON u.idrole = r.idrole WHERE u.email = $1`,
      [email]
    );
    return res.rows[0] || null;
  }
}



/*
import { pool } from "../db.js";
import { Role } from "./Role.js";

export class Utilisateur {
  constructor(idutilisateur, nom, email, motdepasse, idrole) {
    this.idutilisateur = idutilisateur;
    this.nom = nom;
    this.email = email;
    this.motdepasse = motdepasse;
    this.idrole = idrole;
  }

  static async findById(id) {
    const res = await pool.query("SELECT * FROM utilisateur WHERE idutilisateur = $1", [id]);
    return res.rows[0];
  }

  static async create(data) {
    const { nom, motdepasse, email, idrole } = data;
    const res = await pool.query(
      `INSERT INTO utilisateur (nom, motdepasse, email, idrole)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nom, motdepasse, email, idrole]
    );
    return res.rows[0];
  }

  static async findWithRole(email) {
    const res = await pool.query(
      `SELECT u.*, r.nomrole 
       FROM utilisateur u 
       JOIN role r ON u.idrole = r.idrole 
       WHERE u.email = $1`,
      [email]
    );
    return res.rows[0];
  }
}
*/
