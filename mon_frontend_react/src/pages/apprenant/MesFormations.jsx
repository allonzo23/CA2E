// src/pages/apprenant/MesFormations.jsx
import { useEffect, useState } from "react";
import { FaPlus, FaCalendarAlt, FaTimes } from "react-icons/fa";
import api from "../../api/api";
import BoutonInscription from "./BoutonInscription";
import { useDashboard } from "../../context/DashboardContext";

function MesFormations() {
  const { state } = useDashboard();
  const user = state.user;
  const idApprenant = user?.idutilisateur;
  const [formations, setFormations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formationSelectionnee, setFormationSelectionnee] = useState(null);
  const [seances, setSeances] = useState([]);
  const [seancesVisible, setSeancesVisible] = useState(false);

  useEffect(() => {
    if (!idApprenant) return;
    const fetchFormations = async () => {
      try {
        const res = await api.get(`/apprenants/${idApprenant}/formations`);
        setFormations(res.data);
      } catch (err) {
        console.error("Erreur API :", err);
      }
    };
    fetchFormations();
  }, [idApprenant]);

  const handleAddFormation = (newFormation) => {
    setFormations((prev) => [...prev, newFormation]);
  };

  const handleVoirSeances = async (formation) => {
    try {
      const res = await api.get(`/formations/${formation.idformation}/seances`);
      setSeances(res.data);
      setFormationSelectionnee(formation);
      setSeancesVisible(true);
    } catch (err) {
      console.error("Erreur lors du chargement des séances :", err);
    }
  };

  return (
    <div className="mes-formations-container" style={{ padding: "20px" }}>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        Mes Formations
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #27ae60, #2ecc71)",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
          onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
        >
          <FaPlus /> Nouvelle formation
        </button>
      </h2>

      {formations.length === 0 ? (
        <p>Aucune formation trouvée.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "15px",
          }}
        >
          {formations.map((f) => (
            <div
              key={f.idformation}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)")
              }
            >
              <h3 style={{ marginBottom: "8px", color: "#2c3e50" }}>{f.titre}</h3>
              <p style={{ marginBottom: "10px" }}>
                <strong>Statut :</strong>{" "}
                <span
                  style={{
                    color: f.statut === "confirmé" ? "#27ae60" : "#c0392b",
                    fontWeight: "bold",
                  }}
                >
                  {f.statut}
                </span>
              </p>

              {f.statut === "confirmé" && (
                <button
                  onClick={() => handleVoirSeances(f)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: "linear-gradient(135deg, #2980b9, #3498db)",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
                >
                  <FaCalendarAlt /> Voir les séances
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <BoutonInscription
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idApprenant={idApprenant}
        onSuccess={handleAddFormation}
      />

      {seancesVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px 25px",
              width: "420px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>
              Séances de {formationSelectionnee.titre}
            </h3>
            {seances.length === 0 ? (
              <p>Aucune séance trouvée.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {seances.map((s) => (
                  <li
                    key={s.idseance}
                    style={{
                      background: "#ecf0f1",
                      borderRadius: "6px",
                      padding: "8px 10px",
                      marginBottom: "8px",
                    }}
                  >
                    📅 {new Date(s.date_seance).toLocaleDateString()} —{" "}
                    {s.heure || "Heure non définie"}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setSeancesVisible(false)}
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #c0392b, #e74c3c)",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.3s",
                width: "100%",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
            >
              <FaTimes /> Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MesFormations;
