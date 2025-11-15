import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../../api/api";

function BoutonInscription({ isOpen, onClose, idApprenant, onSuccess }) {
  const [formationsDispo, setFormationsDispo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🔹 Charger les formations disponibles à l’ouverture du modal
  useEffect(() => {
    if (!isOpen || !idApprenant) return;
  
    const fetchFormations = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/inscriptions/formation/${idApprenant}`);
        console.log(res.data);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
          console.log(data);
        setFormationsDispo(data);
        
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setFormationsDispo([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFormations();
  }, [isOpen, idApprenant]); // ✅ ici  

  // 🔹 Inscription à une formation
  const handleInscription = async (idformation) => {
    try {
      console.log("Token envoyé :", localStorage.getItem("token"));
      console.log("idApprenant :", idApprenant, "idformation :", idformation);
      const res = await api.post("/inscriptions", {
        idutilisateur: idApprenant,
        idformation
      });

      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Inscription réussie !");
        // Appeler le parent pour mettre à jour la liste
        if (onSuccess) onSuccess(res.data);
      } else {
        setMessage("⚠️ Erreur lors de l’inscription.");
      }
    } catch (err) {
      console.error("Erreur inscription :", err);
      setMessage("❌ Déjà inscrit ou erreur serveur.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // 🔹 Si le modal est fermé → ne rien afficher
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "420px",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>📘 Formations disponibles</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#e74c3c",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <FaTimes />
          </button>
        </div>

        {message && (
          <p
            style={{
              marginTop: "10px",
              color: message.includes("✅") ? "green" : "red",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        <div style={{ marginTop: "15px" }}>
          {loading ? (
            <p>Chargement des formations...</p>
          ) : formationsDispo.length === 0 ? (
            <p>Aucune formation disponible.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {formationsDispo.map((formation) => (
                <li
                  key={formation.idformation}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>{formation.titre}</span>
                  <button
                    onClick={() => handleInscription(formation.idformation)}
                    style={{
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    S’inscrire
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoutonInscription;






/*
import api from "../../api/api";
import { FaPlus } from "react-icons/fa";

function BoutonInscription({ idApprenant, idFormation, statut, onSuccess }) {
  const handleInscription = async () => {
    if (statut) {
      alert(`Vous êtes déjà inscrit (${statut})`);
      return;
    }
    try {
      await api.post(`/inscriptions`, {
        idapprenant: idApprenant,
        idformation: idFormation
      });
      alert("Inscription réussie !");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <button onClick={handleInscription} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <FaPlus /> S'inscrire
    </button>
  );
}

export default BoutonInscription;




/*
import { useState } from "react";
import api from "../../api/api";
import { FiPlus } from "react-icons/fi";

function BoutonInscription({ idApprenant, idFormation, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInscription = async () => {
    setLoading(true);
    setMessage("");

    try {
      // On envoie simplement la requête d'inscription
      const res = await api.post(`/inscription`, {
        idutilisateur: idApprenant,
        idformation: idFormation
      });

      // Le backend renvoie success ou message d'erreur si déjà inscrit
      if (res.data.success) {
        setMessage("Inscription réussie !");
        if (onSuccess) onSuccess(); // rafraîchir la liste
      } else {
        setMessage(res.data.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur, réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleInscription} 
        disabled={loading}
        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", cursor: "pointer" }}
      >
        {loading ? "En cours..." : <><FiPlus /> S'inscrire</>}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default BoutonInscription;
*/
