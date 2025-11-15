// src/pages/formateur/FormateurFormation.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";
import { useDashboard } from "../../context/DashboardContext";

function FormateurFormation() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // 👈 État pour le modal

  // Champs du formulaire
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    duree: "",
    datedebut: "",
    datefin: "",
  });

  const { state } = useDashboard();
  const user = state.user;
  const idFormateur = user?.idutilisateur;

  // 🔹 Récupérer les formations existantes
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await api.get(`/liaisons/formateur/${idFormateur}`);
        console.log(response.data);
        const data = response.data;
        const dataArray = Array.isArray(data) ? data : [data];
        setFormations(dataArray);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des formations");
      } finally {
        setLoading(false);
      }
    };

    if (idFormateur) fetchFormations();
    else {
      setError("Aucun formateur connecté");
      setLoading(false);
    }
  }, [idFormateur]);

  // 🔹 Gérer le changement des champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Soumettre le formulaire de création
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newFormation = {
        ...formData,
        idformateur: idFormateur,
        duree: { days: parseInt(formData.duree) },
      };

      const response = await api.post("/formations", newFormation);

      // Ajouter la nouvelle formation dans la liste
      setFormations([...formations, response.data]);
      setShowModal(false);
      setFormData({ titre: "", description: "", duree: "", datedebut: "", datefin: "" });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la formation !");
    }
  };

  // 🔹 Affichages conditionnels
  if (loading) return <p>Chargement des formations...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📚 Mes Formations</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Nouvelle Formation
        </button>
      </div>

      {/* Tableau des formations */}
      {formations.length === 0 ? (
        <p>Aucune formation trouvée.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Titre</th>
              <th style={cellStyle}>Description</th>
              <th style={cellStyle}>Durée (jours)</th>
              <th style={cellStyle}>Date début</th>
              <th style={cellStyle}>Date fin</th>
            </tr>
          </thead>
          <tbody>
            {formations.map((formation) => (
              <tr key={formation.idformation} style={{ textAlign: "center" }}>
                <td style={cellStyle}>{formation.idformation}</td>
                <td style={cellStyle}>{formation.titre}</td>
                <td style={cellStyle}>{formation.description}</td>
                <td style={cellStyle}>{formation.duree?.days || "N/A"}</td>
                <td style={cellStyle}>{new Date(formation.datedebut).toLocaleDateString()}</td>
                <td style={cellStyle}>{new Date(formation.datefin).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de création */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Créer une nouvelle formation</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Titre :
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </label>
              <label>
                Description :
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </label>
              <label>
                Durée (jours) :
                <input
                  type="number"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </label>
              <label>
                Date de début :
                <input
                  type="date"
                  name="datedebut"
                  value={formData.datedebut}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </label>
              <label>
                Date de fin :
                <input
                  type="date"
                  name="datefin"
                  value={formData.datefin}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </label>

              <div style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ marginRight: "10px", backgroundColor: "#ccc", padding: "8px 12px" }}
                >
                  Annuler
                </button>
                <button type="submit" style={{ backgroundColor: "#27ae60", color: "white", padding: "8px 12px" }}>
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalContent = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 10px 0",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

export default FormateurFormation;
