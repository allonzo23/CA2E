import pool from "../db.js";

export const assignFormateurToFormation = async (idformation, idformateur) => {
  try {
    const result = await pool.query(
      `INSERT INTO formation_formateur (idformation, idformateur)
       VALUES ($1, $2)
       RETURNING *`,
      [idformation, idformateur]
    );
    return result.rows[0];
  } catch (error) {
    console.error("❌ Erreur lors de l’insertion dans formation_formateur :", error);
    throw error;
  }
};

export const getFormateursByFormation = async (idformation) => {
  const result = await pool.query(
    `SELECT fo.* 
     FROM formateur fo
     JOIN formation_formateur ff ON fo.idutilisateur = ff.idformateur
     WHERE ff.idformation = $1`,
    [idformation]
  );
  return result.rows;
};

export const getFormationsByFormateur = async (idformateur) => {
  const result = await pool.query(
    `SELECT f.* 
     FROM formation f
     JOIN formation_formateur ff ON f.idformation = ff.idformation
     WHERE ff.idformateur = $1`,
    [idformateur]
  );
  return result.rows;
};
