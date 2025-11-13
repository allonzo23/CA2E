import pool from "../db.js";

export class SuiviAccompagnement {
    static async findSuivisByAccompagnement(idaccompagnement){
        const result = await pool.query(
            `
            SELECT
                s.idsuivi,
                s.date_suivi,
                s.commentaire,
                s.progression,
                s.remarque_formateur,
                u.nom AS formateur_nom,
                u.email AS formateur_email
                    FROM suivi_accompagnement s
                JOIN formateur f ON s.created_by = f.idutilisateur
                JOIN utilisateur u ON f.idutilisateur = u.idutilisateur
                    WHERE s.idaccompagnement = $1
                        ORDER BY s.date_suivi ASC;
              `,
              [idaccompagnement]
            );
            return result.rows;
          
    }


    static async insertSuiviAccompagnement(idaccompagnement, { commentaire, progression, remarque_formateur, created_by  }){
        const result = await pool.query(
            `INSERT INTO suivi_accompagnement (idaccompagnement, commentaire, progression, remarque_formateur, created_by)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [idaccompagnement, commentaire, progression, remarque_formateur, created_by]
            );
            return result.rows[0];
          
    }
    
     // 📊 Calculer la progression moyenne d’un accompagnement
  static async getMoyenneProgression(idaccompagnement) {
    const result = await pool.query(
      `SELECT COALESCE(AVG(progression), 0) AS progression_moyenne
       FROM suivi_accompagnement
       WHERE idaccompagnement = $1`,
      [idaccompagnement]
    );
    return result.rows[0].progression_moyenne;
  }

  // ❌ Supprimer un suivi
  static async deleteSuivi(idsuivi) {
    await pool.query(`DELETE FROM suivi_accompagnement WHERE idsuivi = $1`, [idsuivi]);
    return { message: "Suivi supprimé avec succès" };
  }

}