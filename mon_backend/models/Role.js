import { pool } from "../db.js";

export class Role {
  static async getAll() {
    const res = await pool.query("SELECT * FROM role");
    return res.rows;
  }

  static async findById(id) {
    const res = await pool.query("SELECT * FROM role WHERE idrole = $1", [id]);
    return res.rows[0];
  }
}
