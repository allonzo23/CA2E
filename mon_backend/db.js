import pg from "pg";
//import dotenv from "dotenv";

//dotenv.config();

// db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/*
const { Pool } = pg;
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password:"",
    database: "CA2E",
});


const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
*/

pool.connect()
.then(client => {
    console.log("connexion à la DB reussite !");
    client.release();
})
.catch(err => console.error("Erreur de connexion aux DB", err.stack));

export default pool;