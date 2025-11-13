import QRCode from "qrcode";

// Exemple : générer un QR code pour une URL
const data = "https://www.exemple.com";


QRCode.toDataURL("https://www.exemple.com", function (err, url) {
  console.log(url); // chaîne base64 que tu peux afficher dans <img src="..." />
});
