// src/pages/apprenant/MesEvaluations.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";
import { useDashboard } from "../../context/DashboardContext";

function MesEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 On récupère l'utilisateur connecté dans le localStorage
  const { state } = useDashboard();
  const user = state.user;
  const idApprenant = user?.idutilisateur; // correspond à l'id de l'apprenant

  useEffect(() => {
    if (!idApprenant) {
      console.error("❌ Aucun idApprenant trouvé dans localStorage !");
      setLoading(false);
      return;
    }

    // 🔥 Requête vers ton API
    api
      .get(`/apprenants/${idApprenant}/evaluations`)
      .then((res) => {
        console.log("✅ Évaluations récupérées :", res.data);
        setEvaluations(res.data);
      })
      .catch((err) => {
        console.error("❌ Erreur API :", err);
      })
      .finally(() => setLoading(false));
  }, [idApprenant]);

  if (loading) return <p>Chargement des évaluations...</p>;
  if (!evaluations.length) return <p>Aucune évaluation trouvée.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mes Évaluations</h2>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left py-3 px-4">Formation</th>
            <th className="text-left py-3 px-4">Formateur</th>
            <th className="text-left py-3 px-4">Note</th>
            <th className="text-left py-3 px-4">Commentaire</th>
            <th className="text-left py-3 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((ev) => (
            <tr key={ev.idevaluation} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{ev.titre_formation}</td>
              <td className="py-2 px-4">{ev.nom_formateur}</td>
              <td className="py-2 px-4">{ev.note}</td>
              <td className="py-2 px-4">{ev.commentaire}</td>
              <td className="py-2 px-4">
                {new Date(ev.date).toLocaleDateString("fr-FR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MesEvaluations;


/*
import { useEffect, useState } from "react";
import api from "../../api/api";

function MesEvaluations({ user }) {
  const idApprenant = user?.idutilisateur;
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    if (!idApprenant) {
      console.error("❌ Aucun idApprenant trouvé dans localStorage !");
      return;
    }

    api
      .get(`/apprenant/${idApprenant}`)
      .then((res) => setEvaluations(res.data))
      .catch((err) => console.error("Erreur API :", err));
  }, [idApprenant]);

  if (!evaluations.length) return <p>Aucune évaluation trouvée.</p>;

  return (
    <div>
      <h2>Mes Évaluations</h2>
      <ul>
        {evaluations.map((e) => (
          <li key={e.idevaluation}>
            Formation #{e.idformation} : <strong>{e.note}</strong> — {e.commentaire}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MesEvaluations;




/*
function MesEvaluations() {
    return (
      <div>
        <h2>Mes Évaluations</h2>
        <ul>
          <li>Quiz JavaScript - 85%</li>
          <li>Projet React - 92%</li>
        </ul>
      </div>
    );
  }
  
  export default MesEvaluations;
*/