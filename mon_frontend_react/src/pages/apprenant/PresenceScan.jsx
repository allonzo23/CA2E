import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import api from "../../api/api";

function PresenceScan() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // "user" = avant, "environment" = arrière
  const [availableCameras, setAvailableCameras] = useState([]);

  // 🔹 Récupère la liste des caméras disponibles
  useEffect(() => {
    async function fetchCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setAvailableCameras(videoInputs);
      } catch (err) {
        console.error("Erreur détection caméras :", err);
        setMessage("⚠️ Impossible de détecter les caméras.");
      }
    }

    fetchCameras();
  }, []);

  // 🔹 Lecture du QR code
  const handleScan = async (result) => {
    if (!result || data) return;

    setData(result);
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/presence/validate", { token: result });
      if (response.status === 200) setMessage("✅ Présence validée !");
      else setMessage("❌ Validation échouée.");
    } catch (err) {
      console.error("Erreur API :", err);
      setMessage(
        err.response?.data?.message || "⚠️ Erreur de connexion au serveur"
      );
    } finally {
      setLoading(false);
      setTimeout(() => setData(null), 4000); // reset pour scanner un autre QR
    }
  };

  // 🔹 Gestion des erreurs du scanner
  const handleError = (err) => {
    console.error("Erreur scanner :", err);
    if (err.name === "OverconstrainedError" || err.name === "NotReadableError") {
      setMessage("⚠️ Caméra non compatible ou occupée.");
    } else if (err.name === "NotAllowedError") {
      setMessage("🚫 Accès à la caméra refusé. Autorisez la caméra.");
    } else {
      setMessage(`⚠️ Erreur inconnue: ${err.name}`);
    }
  };

  // 🔹 Bascule entre caméras avant/arrière
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Scanner le code QR de présence</h2>

      <div
        style={{
          width: "320px",
          margin: "auto",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ video: { facingMode } }}
          style={{ width: "100%", borderRadius: "10px" }}
        />
      </div>

      {availableCameras.length > 1 && (
        <button
          onClick={toggleCamera}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔄 Basculer caméra ({facingMode === "environment" ? "arrière" : "avant"})
        </button>
      )}

      {data && (
        <div>
          <h4>QR détecté :</h4>
          <p>{data}</p>
        </div>
      )}

      {loading && <p>⏳ Vérification de la présence...</p>}

      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message.includes("✅") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default PresenceScan;
