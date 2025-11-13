import pool from "../db.js";

export async function getSeanceById(idseance) {
  const res = await pool.query("SELECT * FROM seance WHERE idseance=$1", [idseance]);
  return res.rows[0];
}
