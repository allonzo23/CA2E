//import { pool } from "../db.js";
import pool from "../db.js";

class Formation {
  constructor(idformation, titre, description, duree, datedebut, datefin) {
    this.idformation = idformation;
    this.titre = titre;
    this.description = description;
    this.duree = duree;
    this.datedebut = datedebut;
    this.datefin = datefin;
  }

  static async getAll() {
    const result = await pool.query("select f.idformation, f.titre as formation, f.datedebut, f.datefin, f.etat from formation as f");
    return result.rows;
  }
 
  //afficher compter par idformateur
  static async getCompterFormation(idformateur) {
    const result = await pool.query(
      `select count(f.idformation) as nombre_formation from formation as f join
      formation_formateur as ff on f.idformation = ff.idformation join
      formateur as fo on fo.idutilisateur = ff.idformateur
      where fo.idutilisateur = $1`, 
      [idformateur]
      );
      return result.rows;
  }


  //afficher nombre apprenant par idformateur groupé par formation
  static async getCompterApprenant(idformateur) {
    const result = await pool.query(
      `select count(a.idutilisateur) as nombre_apprenant, f.titre as formation from formation as f join
      inscription as i on f.idformation = i.idformation join
      apprenant a on a.idutilisateur = i.idutilisateur join 
      formation_formateur as ff on f.idformation = ff.idformation join
      formateur as fo on fo.idutilisateur = ff.idformateur 
      where fo.idutilisateur = $1
      group by formation`, 
      [idformateur]
      );
      return result.rows;
  }


  //afficher nombre apprenant qui a été fait l'evaluation par formateur groupé par formation
  static async getCompterApprenantEvaluation(idformateur) {
    const result = await pool.query(
      `select count(a.idutilisateur) as nombre_apprenant, f.titre as formation from evaluation as e join
      apprenant a on a.idutilisateur = e.idapprenant join
      formation f on f.idformation = e.idformation join
      formateur fo on fo.idutilisateur = e.idformateur
      where fo.idutilisateur = $1
      group by formation`, 
      [idformateur]
      );
      return result.rows;
  }



  static async getTous() {
    const result = await pool.query(`
      SELECT f.idformation,
            f.titre AS formation,
             u.nom AS formateur,
             f.datedebut,
             f.datefin,
             f.etat
      FROM formation f
      JOIN formation_formateur ff ON f.idformation = ff.idformation
      JOIN utilisateur u ON u.idutilisateur = ff.idformateur
    `);
    return result.rows;
  }
  static async getById(id) {
    const result = await pool.query("SELECT * FROM formation WHERE idformation = $1", [id]);
    return result.rows[0];
  }

  static async getFormationByIdFormateur(id) {
    const result = await pool.query(
      `select f.titre from formation f join formation_formateur ff
      on f.idformation = ff.idformation join formateur ftr on
      ftr.idutilisateur = ff.idformateur where ftr.idutilisateur = $1`, 
      [id]
      );
      return result.rows[0];
  }

  static async create(data) {
    const { titre, description, duree, datedebut, datefin } = data;
    const result = await pool.query(
      `INSERT INTO formation (titre, description, duree, datedebut, datefin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titre, description, duree, datedebut, datefin]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { titre, description, duree, datedebut, datefin } = data;
    const result = await pool.query(
      `UPDATE formation 
       SET titre=$1, description=$2, duree=$3, datedebut=$4, datefin=$5
       WHERE idformation=$6
       RETURNING *`,
      [titre, description, duree, datedebut, datefin, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM formation WHERE idformation = $1 RETURNING *", [id]);
    return result.rows[0];
  }
}

export default Formation;



/*
export class Formation {
    static async createFormation({ titre, description, duree, datedebut, datefin }) {
      const res = await pool.query(
        `INSERT INTO formation (titre, description, duree, datedebut, datefin)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [titre, description, duree, datedebut, datefin]
      );
      return res.rows[0];
    }

    static async getAllFormation() {
        const result = await pool.query("select * from formation order by idformation ASC");
        return result.rows;
    }

    static async getByIdFormation(id) {
        const result = await pool.query("select * from formation where idformation = $1", [id]);
        return result.rows[0];
    }

    static async updateFormation(id, { titre, description, duree, datedebut, datefin }) {
        const result = await pool.query(`update formation set titre = $1, description = $2, duree = $3, datedebut = $4, datefin = $5 where idformation = $6 RETURNING *`, [titre, description, duree, datedebut, datefin, id]);
        return result.rows[0];
    }

    static async deleteFormation (id) {
        await pool.query("delete from formation where idformation = $1", [id]);
        return { message: "Formation supprimé" };
    }
}
*/