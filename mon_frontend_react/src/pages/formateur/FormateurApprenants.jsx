// src/pages/formateur/FormateurApprenants.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";
import { FaUserGraduate } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";

function FormateurApprenants() {
  const [formations, setFormations] = useState([]);
  const [idformation, setIdFormation] = useState(localStorage.getItem("idformation"));
  const [nomFormation, setNomFormation] = useState("");
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { state } = useDashboard();
  const user = state.user;
  const idformateur = user?.idutilisateur;

  // 🔹 Étape 1 : Récupérer les formations du formateur
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const res = await api.get(`/liaisons/formateur/${idformateur}`);
        setFormations(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des formations :", err);
        setError("Impossible de charger vos formations.");
      }
    };
    fetchFormations();
  }, [idformateur]);

  // 🔹 Étape 2 : Charger les données des apprenants pour la formation sélectionnée
  useEffect(() => {
    if (!idformation) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const formationRes = await api.get(`/formations/${idformation}`);
        setNomFormation(formationRes.data.titre || "Formation inconnue");

        const apprenantsRes = await api.get(
          `/apprenants/formations/${idformation}/statistiques`
        );
        setApprenants(apprenantsRes.data);
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idformation]);

  const handleSelectFormation = (e) => {
    const newId = e.target.value;
    localStorage.setItem("idformation", newId);
    setIdFormation(newId);
  };

  if (loading && !idformation) return <p>Chargement des formations...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ display: "flex", alignItems: "center" }}>
        <FaUserGraduate style={{ marginRight: "10px" }} /> Mes Apprenants
      </h2>

      {/* Sélecteur de formation */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="formation">Sélectionner une formation : </label>
        <select
          id="formation"
          onChange={handleSelectFormation}
          value={idformation || ""}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginLeft: "10px",
          }}
        >
          <option value="">-- Choisir --</option>
          {formations.map((f) => (
            <option key={f.idformation} value={f.idformation}>
              {f.titre}
            </option>
          ))}
        </select>
      </div>

      {loading && idformation ? (
        <p>Chargement des apprenants...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : idformation ? (
        <>
          <h3>Apprenants de la formation : {nomFormation}</h3>
          {apprenants.length === 0 ? (
            <p>Aucun apprenant inscrit.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
              }}
            >
              <thead style={{ backgroundColor: "#2c3e50", color: "white" }}>
                <tr>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Taux présence</th>
                  <th style={thStyle}>Progression</th>
                </tr>
              </thead>
              <tbody>
                {apprenants.map((a) => (
                  <tr key={a.idapprenant} style={{ textAlign: "center" }}>
                    <td style={tdStyle}>{a.nom}</td>
                    <td style={tdStyle}>{a.email}</td>
                    <td style={tdStyle}>{a.taux_presence ?? 0}%</td>
                    <td style={tdStyle}>{a.progression ?? 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <p>Veuillez choisir une formation pour voir ses apprenants.</p>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default FormateurApprenants;
