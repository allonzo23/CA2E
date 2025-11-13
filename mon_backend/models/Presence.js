import pool from "../db.js";

export async function markPresence(idseance, idapprenant) {
  await pool.query(
    "UPDATE presence SET est_present=true WHERE idseance=$1 AND idapprenant=$2",
    [idseance, idapprenant]
  );
}
