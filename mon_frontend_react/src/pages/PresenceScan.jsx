// src/pages/PresenceScan.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PresenceScan() {
  const query = useQuery();
  const token = query.get("token");
  const [status, setStatus] = useState("En attente de validation...");

  useEffect(() => {
    if (!token) {
      setStatus("Token manquant dans l'URL");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("Géolocalisation non supportée sur votre appareil");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        try {
          const res = await api.post("/presence/validate", { token, latitude, longitude });
          setStatus(res.data.message || "Présence validée !");
        } catch (err) {
          setStatus(err.response?.data?.message || "Erreur lors de la validation");
        }
      },
      (err) => {
        setStatus("Impossible d'obtenir la géolocalisation : " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [token]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Validation de présence</h2>
      <p>{status}</p>
    </div>
  );
}
