// src/pages/formateur/FormateurQR.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useDashboard } from "../../context/DashboardContext";

export default function FormateurQR() {
  const { idseance } = useParams();
  const navigate = useNavigate();
  const { logout } = useDashboard?.() ?? {}; // si useDashboard disponible

  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const refreshIntervalRef = useRef(null);

  // Fonction pour récupérer le QR code (retourne true si ok)
  const fetchQrCode = useCallback(async () => {
    try {
      const res = await api.get(`/qrcode/${idseance}`);
      // Debug: log pour vérifier la structure
      console.log("qrcode api res.data =", res.data);

      // Plusieurs formats possibles :
      // { qrDataUrl: "...", expiresIn: 45 }  OR  { dataUrl: "...", ttl: 45 } etc.
      const qr = res.data.qrDataUrl ?? res.data.dataUrl ?? res.data.qr;
      const expiresIn = res.data.expiresIn ?? res.data.ttl ?? res.data.expires_seconds;

      if (!qr) {
        throw new Error("Réponse API: pas de qrDataUrl trouvé");
      }

      setQrDataUrl(qr);

      // expireAt calculé à partir de now + expiresIn (si fourni), sinon set timer à 45s par défaut
      const durationSec = Number(expiresIn) || 45;
      const now = new Date();
      setExpiresAt(new Date(now.getTime() + durationSec * 1000));
      setTimer(durationSec);
      setError("");
      return true;
    } catch (err) {
      console.error("Erreur génération QR :", err);
      if (err.response?.status === 401) {
        alert("Session expirée, veuillez vous reconnecter.");
        logout?.();
        navigate("/login");
        return false;
      }
      setError(err.response?.data?.message || err.message || "Erreur lors de la génération du QR");
      return false;
    }
  }, [idseance, navigate, logout]);

  // Génération initiale ; n'installe le refresh interval que si la première fetch réussit
  useEffect(() => {
    let mounted = true;
    (async () => {
      const ok = await fetchQrCode();
      if (!mounted) return;
      if (ok) {
        // on remet à zéro l'intervale s'il existait
        if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = setInterval(fetchQrCode, 45000);
      }
    })();

    return () => {
      mounted = false;
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [fetchQrCode]);

  // Compte à rebours
  useEffect(() => {
    if (!expiresAt) return;
    const countdown = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(Math.floor((expiresAt - now) / 1000), 0);
      setTimer(remaining);
    }, 1000);
    return () => clearInterval(countdown);
  }, [expiresAt]);

  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
  if (!qrDataUrl) return <p>Chargement du QR code...</p>;

  return (
    <div style={containerStyle}>
      <h2>📱 QR Code de la séance {idseance}</h2>
      <p style={{ marginBottom: "15px" }}>Ce code est valable <b>{timer}</b> secondes et se renouvelle automatiquement.</p>

      <div style={qrBoxStyle}>
        <img src={qrDataUrl} alt="QR Code" style={{ width: 280, height: 280 }} />
      </div>

      <p style={{ marginTop: "10px" }}>
        ⏳ Temps restant avant expiration : <b style={{ color: timer < 10 ? "red" : "green" }}>{timer}s</b>
      </p>

      <button style={buttonStyle} onClick={() => navigate(-1)}>🔙 Retour</button>
    </div>
  );
}

// Styles (comme ton original)
const containerStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", minHeight: "100vh", backgroundColor: "#f7f9fa" };
const qrBoxStyle = { padding: "20px", borderRadius: "12px", backgroundColor: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const buttonStyle = { marginTop: "20px", padding: "10px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" };
