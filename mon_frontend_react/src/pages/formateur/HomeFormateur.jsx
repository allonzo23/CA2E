// src/pages/formateur/HomeFormateur.jsx
import { useEffect, useState } from "react";
import api from '../../api/api';
import { FaBook, FaUsers, FaClipboardList } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";

function HomeFormateur() {
  const [stats, setStats] = useState({ formations: 0, apprenants: 0, evaluations: 0 });
  //const [formateur, setFormateur] = useState(null);

  const { state } = useDashboard();
  const user = state.user;
  const idFormateur = user?.idutilisateur;

  useEffect(() => {

    if (idFormateur) {
      // Appeler les statistiques du formateur
      api.get(`/formateurs/${idFormateur}/stats`)
        .then(response => {
          console.log('✅ Stats:', response.data);
          // Votre code...
        })
        .catch(error => {
          console.error('❌ Erreur stats:', error);
        });
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>
        👋 Bienvenue {user?.nom || "cher Formateur"} !
      </h2>
      <p>Voici un aperçu rapide de votre activité :</p>

      {/* Cartes statistiques */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>
          <FaBook size={28} color="#2980b9" />
          <h3>{stats.formations}</h3>
          <p>Formations créées</p>
        </div>

        <div style={cardStyle}>
          <FaUsers size={28} color="#27ae60" />
          <h3>{stats.apprenants}</h3>
          <p>Apprenants inscrits</p>
        </div>

        <div style={cardStyle}>
          <FaClipboardList size={28} color="#e67e22" />
          <h3>{stats.evaluations}</h3>
          <p>Évaluations effectuées</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>🗓️ Dernières activités</h3>
        <p>Consultez vos dernières formations ou accompagnements récents dans le menu à gauche.</p>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  padding: "20px",
  textAlign: "center",
};

export default HomeFormateur;
