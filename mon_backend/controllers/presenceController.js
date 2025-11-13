import jwt from "jsonwebtoken";
import { getApprenantByUtilisateur } from "../models/Apprenant.js";
import { getSeanceById } from "../models/Seances.js";
import { markPresence } from "../models/Presence.js";

export async function validatePresence(req, res) {
  const { token, latitude, longitude } = req.body;
  const idutilisateur = req.user.idutilisateur;

  const apprenant = await getApprenantByUtilisateur(idutilisateur);
  if (!apprenant) return res.status(404).json({ message: "Apprenant introuvable" });

  let payloadQR;
  try {
    payloadQR = jwt.verify(token, process.env.JWT_QR_SECRET);
  } catch {
    return res.status(400).json({ message: "QR expiré ou invalide" });
  }
  const idseance = payloadQR.idseance;

  const seance = await getSeanceById(idseance);
  if (!seance) return res.status(404).json({ message: "Séance introuvable" });

  // Vérification position (optionnelle)
  function haversine(lat1, lon1, lat2, lon2) {
    const toRad = v => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  if (latitude && longitude) {
    const distance = haversine(latitude, longitude, seance.lat, seance.lon);
    if (distance > parseInt(process.env.PRESENCE_TOLERANCE_M || "100", 10)) {
      return res.status(403).json({ message: `Hors de la zone (${Math.round(distance)} m)` });
    }
  }

  await markPresence(idseance, apprenant.idapprenant);

  res.json({ message: "Présence validée ✅" });
}
