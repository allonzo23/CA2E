import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useDashboard } from "../../context/DashboardContext";

function FormateurSeancePresence() {
  const [formations, setFormations] = useState([]);
  const [seances, setSeances] = useState([]);
  const [presences, setPresences] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState("");
  const [selectedSeance, setSelectedSeance] = useState("");
  const [dateSeance, setDateSeance] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { state } = useDashboard();
  const user = state.user;
  const idFormateur = user?.idutilisateur;

  // Charger les formations du formateur
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const res = await api.get(`/liaisons/formateur/${idFormateur}`);
        setFormations(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des formations");
      } finally {
        setLoading(false);
      }
    };
    fetchFormations();
  }, [idFormateur]);

  // Charger les séances d’une formation
  useEffect(() => {
    if (!selectedFormation) return;
    const fetchSeances = async () => {
      try {
        const res = await api.get(`/presence_seance/seances/${selectedFormation}`);
        setSeances(res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Erreur serveur");
      }
    };
    fetchSeances();
  }, [selectedFormation]);

  // Charger les présences d’une séance
  useEffect(() => {
    if (!selectedSeance) return;
    const fetchPresences = async () => {
      try {
        const res = await api.get(`/presence_seance/presences/seance/${selectedSeance}`);
        setPresences(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPresences();
  }, [selectedSeance]);

  // Créer une séance
  const handleCreateSeance = async (e) => {
    e.preventDefault();
    if (!selectedFormation || !dateSeance)
      return alert("Remplis tous les champs avant de créer une séance");
    try {
      const res = await api.post("/presence_seance/seances", {
        idformation: selectedFormation,
        date_seance: dateSeance,
      });
      setSeances([...seances, res.data]);
      setDateSeance("");
      alert("✅ Séance créée avec succès !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la création de la séance");
    }
  };

  // Basculer la présence
  const togglePresence = async (idpresence, est_present) => {
    try {
      await api.put(`/presence_seance/presences/${idpresence}`, {
        est_present: !est_present,
      });
      setPresences(
        presences.map((p) =>
          p.idpresence === idpresence ? { ...p, est_present: !est_present } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de la présence");
    }
  };

  // Afficher le QR code
  const handleVoirQrCode = (idseance) => {
    navigate(`/formateur/qrcode/${idseance}`);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Gestion des séances & présences</h2>

      {/* Sélection formation */}
      <label>
        Choisir une formation :
        <select
          value={selectedFormation}
          onChange={(e) => setSelectedFormation(e.target.value)}
          style={inputStyle}
        >
          <option value="">-- Sélectionner --</option>
          {formations.map((f) => (
            <option key={f.idformation} value={f.idformation}>
              {f.titre}
            </option>
          ))}
        </select>
      </label>

      {/* Création séance */}
      {selectedFormation && (
        <form onSubmit={handleCreateSeance} style={{ marginTop: "15px" }}>
          <label>
            Date de la séance :
            <input
              type="date"
              value={dateSeance}
              onChange={(e) => setDateSeance(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <button type="submit" style={buttonGreen}>
            ➕ Créer séance
          </button>
        </form>
      )}

      {/* Liste des séances */}
      {seances.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>📘 Séances existantes</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {seances.map((s, index) => {
              const id = s.idseance ?? s.id_seance ?? index;
              return (
                <li
                  key={id}
                  style={{
                    backgroundColor:
                      selectedSeance === id ? "#ecf0f1" : "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Séance du{" "}
                    {new Date(s.date_seance || s.dateseance).toLocaleDateString(
                      "fr"
                    )}
                  </span>
                  <div>
                    <button
                      style={buttonBlue}
                      onClick={() => handleVoirQrCode(id)}
                    >
                      📱 Voir QR Code
                    </button>
                    <button
                      style={buttonGray}
                      onClick={() => setSelectedSeance(id)}
                    >
                      👥 Voir présences
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Présences */}
      {selectedSeance && (
        <div style={{ marginTop: "20px" }}>
          <h3>👥 Liste des présences</h3>
          {presences.length === 0 ? (
            <p>Aucune donnée de présence.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
                  <th style={cellStyle}>Apprenant</th>
                  <th style={cellStyle}>Présent</th>
                </tr>
              </thead>
              <tbody>
                {presences.map((p) => (
                  <tr key={p.idpresence} style={{ textAlign: "center" }}>
                    <td style={cellStyle}>{p.nom_apprenant}</td>
                    <td style={cellStyle}>
                      <input
                        type="checkbox"
                        checked={p.est_present}
                        onChange={() =>
                          togglePresence(p.idpresence, p.est_present)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const inputStyle = { marginLeft: "10px", marginBottom: "10px", padding: "5px" };
const buttonGreen = {
  backgroundColor: "#27ae60",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "10px",
};
const buttonBlue = {
  backgroundColor: "#2980b9",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "5px",
};
const buttonGray = {
  backgroundColor: "#7f8c8d",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
const cellStyle = { border: "1px solid #ccc", padding: "8px" };

export default FormateurSeancePresence;
