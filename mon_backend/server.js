// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import formationRoutes from "./routes/formationRoutes.js";
import inscriptionRoutes from "./routes/inscriptionRoutes.js";
import accompagnementRoutes from "./routes/accompagnementRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import presence_seance_Routes from "./routes/presence_seance_Routes.js";
import formationFormateurRoutes from "./routes/formationFormateurRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import qrcodeRoutes from "./routes/qrcodeRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";
import suiviAccompagnementRoutes from "./routes/suiviAccompagnementRoutes.js";
import apprenantRoutes from "./routes/apprenantRoutes.js";
import { pool } from "./db.js";

dotenv.config();
const app = express();

// ✅ Autoriser toutes les origines (ou remplacer par l'IP front-end)
// ✅ Remplacer * par l'URL de ton frontend
const allowedOrigins = [
  "http://185.229.224.232:8080",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback){
    // autorise Postman ou requêtes sans origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS policy: This origin is not allowed';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // autorise cookies / auth
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/accompagnements", accompagnementRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/presence_seance", presence_seance_Routes);
app.use("/api/qrcode", qrcodeRoutes);
app.use("/api/presence", presenceRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/suivi_accompagnement", suiviAccompagnementRoutes);
app.use("/api/liaisons", formationFormateurRoutes);
app.use("/api/apprenants", apprenantRoutes);

// Test simple
app.get("/", (req, res) => res.send("API minimal gestion formation "));

const PORT = process.env.PORT || 3001;

// ✅ Écoute sur toutes les interfaces pour Docker
app.listen(PORT, "0.0.0.0", async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log(`Serveur démarré sur : http://0.0.0.0:${PORT}`);
  } catch (err) {
    console.error("Erreur connexion DB :", err.message);
    process.exit(1);
  }
});

//coucou


/*
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import formationRoutes from "./routes/formationRoutes.js";
import inscriptionRoutes from "./routes/inscriptionRoutes.js";
import accompagnementRoutes from "./routes/accompagnementRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import presence_seance_Routes from "./routes/presence_seance_Routes.js"
import formationFormateurRoutes from "./routes/formationFormateurRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

import qrcodeRoutes from "./routes/qrcodeRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";

import suiviAccompagnementRoutes from "./routes/suiviAccompagnementRoutes.js"

import apprenantRoutes from "./routes/apprenantRoutes.js";
import { pool } from "./db.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/accompagnements", accompagnementRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/presence_seance", presence_seance_Routes);

app.use("/api/qrcode", qrcodeRoutes);
app.use("/api/presence", presenceRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/suivi_accompagnement", suiviAccompagnementRoutes);

app.use("/api/liaisons", formationFormateurRoutes);

app.use("/api/apprenants", apprenantRoutes);



app.get("/", (req, res) => res.send("API minimal gestion formation "));

const PORT = process.env.PORT || 3001
app.listen(PORT, "0.0.0.0", async () => {
  try {
    const client = await pool.connect();
    client.release();

    // Récupère l'adresse IP locale automatiquement
    const os = await import("os");
    const interfaces = os.networkInterfaces();
    let localIP = "localhost";
    for (const iface of Object.values(interfaces)) {
      for (const i of iface) {
        if (i.family === "IPv4" && !i.internal) {
          localIP = i.address;
          break;
        }
      }
    }

    console.log(`Serveur démarré sur : http://${localIP}:${PORT}`);
  } catch (err) {
    console.error("Erreur connexion DB :", err.message);
    process.exit(1);
  }
});



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import formationRoutes from "./routes/formationRoutes.js";
import inscriptionRoutes from "./routes/inscriptionRoutes.js";
import accompagnementRoutes from "./routes/accompagnementRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import presence_seance_Routes from "./routes/presence_seance_Routes.js"
import formationFormateurRoutes from "./routes/formationFormateurRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

import qrcodeRoutes from "./routes/qrcodeRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";

import suiviAccompagnementRoutes from "./routes/suiviAccompagnementRoutes.js"

import apprenantRoutes from "./routes/apprenantRoutes.js";
import { pool } from "./db.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/accompagnements", accompagnementRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/presence_seance", presence_seance_Routes);

app.use("/api/qrcode", qrcodeRoutes);
app.use("/api/presence", presenceRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/suivi_accompagnement", suiviAccompagnementRoutes);

app.use("/api/liaisons", formationFormateurRoutes);

app.use("/api/apprenants", apprenantRoutes);



app.get("/", (req, res) => res.send("API minimal gestion formation "));

const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
  } catch (err) {
    console.error("Erreur connexion DB :", err.message);
    process.exit(1);
  }
});
*/
