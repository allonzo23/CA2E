// src/pages/apprenant/MesFormations.jsx
import { useEffect, useState } from "react";
import { FaPlus, FaCalendarAlt, FaTimes, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import api from "../../api/api";
import BoutonInscription from "./BoutonInscription";
import { useDashboard } from "../../context/DashboardContext";
import "./MesFormations.css";

function MesFormations() {
  const { state } = useDashboard();
  const user = state.user;
  const idApprenant = user?.idutilisateur;
  
  const [formations, setFormations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formationSelectionnee, setFormationSelectionnee] = useState(null);
  const [seances, setSeances] = useState([]);
  const [seancesVisible, setSeancesVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSeances, setLoadingSeances] = useState(false);
  const [error, setError] = useState(null);

  // Utiliser la couleur primaire du dashboard
  const PRIMARY_COLOR = "#3b82f6";

  // Chargement des formations
  useEffect(() => {
    if (!idApprenant) return;
    
    const fetchFormations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/apprenants/${idApprenant}/formations`);
        setFormations(res.data);
      } catch (err) {
        console.error("Erreur API :", err);
        setError("Impossible de charger les formations. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormations();
  }, [idApprenant]);

  // Désactiver le scroll quand modal ouverte
  useEffect(() => {
    if (seancesVisible || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [seancesVisible, isModalOpen]);

  const handleAddFormation = (newFormation) => {
    setFormations((prev) => [...prev, newFormation]);
  };

  const handleVoirSeances = async (formation) => {
    try {
      setLoadingSeances(true);
      const res = await api.get(`/formations/${formation.idformation}/seances`);
      setSeances(res.data);
      setFormationSelectionnee(formation);
      setSeancesVisible(true);
    } catch (err) {
      console.error("Erreur lors du chargement des séances :", err);
      alert("Impossible de charger les séances. Veuillez réessayer.");
    } finally {
      setLoadingSeances(false);
    }
  };

  const handleCloseModal = () => {
    setSeancesVisible(false);
    setFormationSelectionnee(null);
    setSeances([]);
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "confirmé":
        return <FaCheckCircle />;
      case "en attente":
        return <FaClock />;
      case "annulé":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  // Affichage du loading
  if (loading) {
    return (
      <div className="formations-loading">
        <div className="spinner"></div>
        <p>Chargement de vos formations...</p>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="formations-error">
        <div className="error-icon">⚠️</div>
        <h3>Une erreur est survenue</h3>
        <p>{error}</p>
        <button 
          className="btn-retry"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="mes-formations-container">
      {/* En-tête avec action principale */}
      <header className="formations-header">
        <div className="header-text">
          <h1>Mes Formations</h1>
          <p className="header-subtitle">
            Gérez et suivez vos formations en cours
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          aria-label="Ajouter une nouvelle formation"
        >
          <FaPlus aria-hidden="true" />
          <span>Nouvelle formation</span>
        </button>
      </header>

      {/* Contenu principal */}
      <main>
        {formations.length === 0 ? (
          <div className="formations-empty">
            <div className="empty-illustration">📚</div>
            <h2>Aucune formation pour le moment</h2>
            <p>Commencez votre parcours d'apprentissage en vous inscrivant à une formation.</p>
            <button 
              className="btn-primary btn-large"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus /> Ajouter ma première formation
            </button>
          </div>
        ) : (
          <div className="formations-grid">
            {formations.map((f) => (
              <article key={f.idformation} className="formation-card">
                <div className="card-header">
                  <h2 className="formation-titre">{f.titre}</h2>
                </div>
                
                <div className="card-body">
                  <div className="formation-meta">
                    <span className="meta-label">Statut</span>
                    <div className={`statut-badge statut-${f.statut.replace(/\s+/g, '-')}`}>
                      {getStatutIcon(f.statut)}
                      <span>{f.statut}</span>
                    </div>
                  </div>

                  {f.description && (
                    <p className="formation-description">{f.description}</p>
                  )}
                </div>

                {f.statut === "confirmé" && (
                  <div className="card-footer">
                    <button
                      className="btn-secondary"
                      onClick={() => handleVoirSeances(f)}
                      disabled={loadingSeances}
                      aria-label={`Voir les séances de ${f.titre}`}
                    >
                      <FaCalendarAlt aria-hidden="true" />
                      <span>Voir les séances</span>
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal d'inscription */}
      {isModalOpen && (
        <BoutonInscription
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          idApprenant={idApprenant}
          onSuccess={handleAddFormation}
        />
      )}

      {/* Modal des séances */}
      {seancesVisible && formationSelectionnee && (
        <div 
          className="modal-overlay" 
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titre"
        >
          <div 
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <h2 id="modal-titre" className="modal-title">
                  Séances de formation
                </h2>
                <p className="modal-subtitle">{formationSelectionnee.titre}</p>
              </div>
              <button
                className="btn-icon"
                onClick={handleCloseModal}
                aria-label="Fermer la fenêtre"
              >
                <FaTimes />
              </button>
            </header>

            <div className="modal-body">
              {loadingSeances ? (
                <div className="modal-loading">
                  <div className="spinner"></div>
                  <p>Chargement des séances...</p>
                </div>
              ) : seances.length === 0 ? (
                <div className="seances-empty">
                  <div className="empty-icon">📅</div>
                  <p>Aucune séance programmée pour cette formation.</p>
                </div>
              ) : (
                <ul className="seances-list">
                  {seances.map((s, index) => (
                    <li key={s.idseance} className="seance-item">
                      <div className="seance-number">{index + 1}</div>
                      <div className="seance-content">
                        <div className="seance-date">
                          <FaCalendarAlt className="seance-icon" />
                          <span>
                            {new Date(s.date_seance).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="seance-heure">
                          {s.heure || "Heure non définie"}
                        </div>
                        {s.lieu && (
                          <div className="seance-lieu">
                            📍 {s.lieu}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="modal-footer">
              <button
                className="btn-secondary btn-block"
                onClick={handleCloseModal}
              >
                Fermer
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default MesFormations;


/*
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
*/