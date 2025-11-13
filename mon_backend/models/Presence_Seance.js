import { pool } from "../db.js";

// Classe Seance
export class Seance {
    constructor(idseance, idformation, date_seance) {
      this.idseance = idseance;
      this.idformation = idformation;
      this.date_seance = date_seance;
    }
  
    static async create(idformation, date_seance) {
      const res = await pool.query(
        'INSERT INTO Seance (idformation, date_seance) VALUES ($1, $2) RETURNING *',
        [idformation, date_seance]
      );
      return res.rows[0];
    }
  
    static async findAll() {
      const res = await pool.query('SELECT * FROM Seance');
      return res.rows;
    }

    // afficher liste de seance
    static async findAllSeance() {
      const res = await pool.query(
        `select s.idseance, f.titre as formation, s.date_seance from seance s join formation f
        on f.idformation = s.idformation`
      );
      return res.rows;
    }
  
    static async findById(idseance) {
      const res = await pool.query('SELECT * FROM Seance WHERE idseance = $1', [idseance]);
      return res.rows[0];
    }

    static async findByIdFormation(id) {
      const res = await pool.query(
        `select f.*, s.idseance, s.date_seance from seance s join formation f 
          on s.idformation = f.idformation
          where f.idformation = $1`,
          [id]
          );
      return res.rows;
    }
  }

  // Classe Presence
export class Presence {
    constructor(idpresence, idseance, idapprenant, est_present) {
      this.idpresence = idpresence;
      this.idseance = idseance;
      this.idapprenant = idapprenant;
      this.est_present = est_present;
    }
  
    static async create(idseance, idapprenant, est_present = false) {
      const res = await pool.query(
        'INSERT INTO Presence (idseance, idapprenant, est_present) VALUES ($1, $2, $3) RETURNING *',
        [idseance, idapprenant, est_present]
      );
      return res.rows[0];
    }
  
    static async findBySeance(idseance) {
      const res = await pool.query(
        'SELECT p.*, a.filiere, u.nom FROM Presence p ' +
        'JOIN Apprenant a ON p.idapprenant = a.idutilisateur ' +
        'JOIN Utilisateur u ON a.idutilisateur = u.idutilisateur ' +
        'WHERE idseance = $1',
        [idseance]
      );
      return res.rows;
    }

      // Afficher les listes de presence
  static async getAllPresence() {
    const res = await pool.query(
      `select p.idpresence, u.nom as apprenant, s.date_seance, f.titre as formation, p.est_present
      from presence p join seance s on s.idseance = p.idseance join formation f
      on f.idformation = s.idformation join utilisateur u on u.idutilisateur = p.idapprenant
      where s.date_seance <= CURRENT_DATE`
    );
    return res.rows;
  } 

    // 🔍 Trouver les présences d’une séance donnée
  static async searchBySeance(idseance) {
    const res = await pool.query(
      `SELECT 
          p.idpresence,
          p.est_present,
          a.idutilisateur AS idapprenant,
          u.nom AS nom_apprenant,
          a.filiere
        FROM Presence p
        JOIN Apprenant a ON p.idapprenant = a.idutilisateur
        JOIN Utilisateur u ON a.idutilisateur = u.idutilisateur
        WHERE p.idseance = $1`,
      [idseance]
    );
    return res.rows;
  } 
  
    static async updatePresence(idpresence, est_present) {
      const res = await pool.query(
        'UPDATE Presence SET est_present=$1 WHERE idpresence=$2 RETURNING *',
        [est_present, idpresence]
      );
      return res.rows[0];
    }
  }