// src/pages/formateur/FormateurAccompagnement.jsx

import { useEffect, useState } from "react";
import api from "../../api/api";
import { FaHandsHelping, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";

function AccompagnementAdmin({ idformateur }) {
  const [accompagnements, setAccompagnements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAccompagnementId, setOpenAccompagnementId] = useState(null);
  const [suivis, setSuivis] = useState({});
  const [showAddFormId, setShowAddFormId] = useState(null);
  const [newSuivi, setNewSuivi] = useState({ commentaire: "", progression: "", remarque_formateur: "" });

  useEffect(() => {
    const fetchAccompagnements = async () => {
      try {
        const res = await api.get(`/accompagnements/${idformateur}/formateur`);
        setAccompagnements(res.data);
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger les accompagnements.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccompagnements();
  }, [idformateur]);

  const toggleSuivis = async (idaccompagnement) => {
    if (openAccompagnementId === idaccompagnement) {
      setOpenAccompagnementId(null);
      return;
    }
    if (!suivis[idaccompagnement]) {
      try {
        const res = await api.get(`/accompagnement/${idaccompagnement}/suivis`);
        setSuivis((prev) => ({ ...prev, [idaccompagnement]: res.data }));
      } catch (err) {
        console.error(err);
        alert("Impossible de charger les suivis.");
        return;
      }
    }
    setOpenAccompagnementId(idaccompagnement);
  };

  const handleAddSuivi = async (idaccompagnement) => {
    try {
      const payload = {
        commentaire: newSuivi.commentaire,
        progression: parseFloat(newSuivi.progression),
        remarque_formateur: newSuivi.remarque_formateur,
        created_by: idformateur,
      };
      await api.post(`/accompagnement/${idaccompagnement}/suivis`, payload);

      // Recharger les suivis
      const res = await api.get(`/accompagnement/${idaccompagnement}/suivis`);
      setSuivis((prev) => ({ ...prev, [idaccompagnement]: res.data }));

      // Recharger la liste des accompagnements pour recalculer la progression moyenne
      const acompRes = await api.get(`/accompagnements/${idformateur}/formateur`);
      setAccompagnements(acompRes.data);

      // Reset formulaire
      setNewSuivi({ commentaire: "", progression: "", remarque_formateur: "" });
      setShowAddFormId(null);
      setOpenAccompagnementId(idaccompagnement);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du suivi.");
    }
  };

  if (loading) return <p>Chargement des accompagnements...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ display: "flex", alignItems: "center" }}>
        <FaHandsHelping style={{ marginRight: "10px" }} /> Mes Accompagnements
      </h2>

      {accompagnements.length === 0 ? (
        <p>Aucun accompagnement trouvé.</p>
      ) : (
        accompagnements.map((a) => (
          <div key={a.idaccompagnement} style={{ border: "1px solid #ddd", marginBottom: "15px", borderRadius: "5px", overflow: "hidden" }}>
            {/* Ligne principale */}
            <div
              onClick={() => toggleSuivis(a.idaccompagnement)}
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div>
                <strong>{a.nom_apprenant}</strong> - {a.formation} ({a.type}) | Progression : {a.progression}%
              </div>
              <div>
                {openAccompagnementId === a.idaccompagnement ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {/* Suivis détaillés */}
            {openAccompagnementId === a.idaccompagnement && (
              <div style={{ backgroundColor: "#f9f9f9", padding: "10px" }}>
                <button
                  onClick={() =>
                    setShowAddFormId(showAddFormId === a.idaccompagnement ? null : a.idaccompagnement)
                  }
                  style={{
                    marginBottom: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  <FaPlus style={{ marginRight: "5px" }} /> Ajouter un suivi
                </button>

                {/* Formulaire ajout suivi */}
                {showAddFormId === a.idaccompagnement && (
                  <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#ecf0f1", borderRadius: "5px" }}>
                    <input
                      type="text"
                      placeholder="Commentaire"
                      value={newSuivi.commentaire}
                      onChange={(e) => setNewSuivi({ ...newSuivi, commentaire: e.target.value })}
                      style={{ width: "100%", marginBottom: "5px" }}
                    />
                    <input
                      type="number"
                      placeholder="Progression (%)"
                      value={newSuivi.progression}
                      onChange={(e) => setNewSuivi({ ...newSuivi, progression: e.target.value })}
                      style={{ width: "100%", marginBottom: "5px" }}
                    />
                    <input
                      type="text"
                      placeholder="Remarque formateur"
                      value={newSuivi.remarque_formateur}
                      onChange={(e) => setNewSuivi({ ...newSuivi, remarque_formateur: e.target.value })}
                      style={{ width: "100%", marginBottom: "5px" }}
                    />
                    <button
                      onClick={() => handleAddSuivi(a.idaccompagnement)}
                      style={{ padding: "5px 10px", backgroundColor: "#2980b9", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                    >
                      Valider
                    </button>
                  </div>
                )}

                {suivis[a.idaccompagnement]?.length === 0 ? (
                  <p>Aucun suivi disponible.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#34495e", color: "white" }}>
                      <tr>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Commentaire</th>
                        <th style={thStyle}>Progression (%)</th>
                        <th style={thStyle}>Remarque Formateur</th>
                        <th style={thStyle}>Formateur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suivis[a.idaccompagnement].map((s) => (
                        <tr key={s.idsuivi}>
                          <td style={tdStyle}>{new Date(s.date_suivi).toLocaleString()}</td>
                          <td style={tdStyle}>{s.commentaire}</td>
                          <td style={tdStyle}>{s.progression ?? 0}%</td>
                          <td style={tdStyle}>{s.remarque_formateur}</td>
                          <td style={tdStyle}>{s.formateur_nom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const thStyle = { padding: "8px", border: "1px solid #ddd" };
const tdStyle = { padding: "8px", border: "1px solid #ddd" };

export default AccompagnementAdmin;


