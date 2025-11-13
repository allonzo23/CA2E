import QRCode from "qrcode";
import jwt from "jsonwebtoken";

export async function generateQr(req, res) {
  const { idseance } = req.params;

  // Générer un token JWT temporaire (60 secondes)
  const payload = { idseance, iat: Math.floor(Date.now() / 1000) };
  //const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "180s" });
  const token = jwt.sign(payload, process.env.JWT_QR_SECRET, { expiresIn: "60s" });



  // Générer le QR code en Data URL
  const qrUrl = `${process.env.APP_URL}/presence/scan?token=${encodeURIComponent(token)}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);

  res.json({ qrDataUrl, expiresIn: 180, idseance });
}
