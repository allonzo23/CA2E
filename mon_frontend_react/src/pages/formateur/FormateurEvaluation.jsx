import { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext"; // ✅ importer le contexte
import api from "../../api/api";

function FormateurEvaluation() {
  const { state } = useDashboard(); // ✅ accès global au user connecté
  const user = state.user;
  const idformateur = user?.idutilisateur; // ou user?.idformateur selon ta structure

  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Charger les évaluations du formateur connecté
  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!idformateur) {
        setError("Aucun formateur connecté");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/evaluations/${idformateur}/formateur`);
        setEvaluations(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des évaluations");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [idformateur]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>📊 Mes Évaluations</h2>
      {evaluations.length === 0 ? (
        <p>Aucune évaluation trouvée.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
              <th style={cellStyle}>Apprenant</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Formation</th>
              <th style={cellStyle}>Note</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((e) => (
              <tr key={e.idevaluation} style={{ textAlign: "center" }}>
                <td style={cellStyle}>{e.nom_apprenant}</td>
                <td style={cellStyle}>{e.email_apprenant}</td>
                <td style={cellStyle}>{e.formation}</td>
                <td style={cellStyle}>{e.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default FormateurEvaluation;
