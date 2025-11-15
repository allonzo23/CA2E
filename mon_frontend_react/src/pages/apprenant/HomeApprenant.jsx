import { useEffect, useState } from "react";
import api from "../../api/api";

function HomeApprenant({ user }) {
  const idApprenant = user?.idutilisateur;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!idApprenant) {
      console.error("❌ Aucun idApprenant trouvé !");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get(`/apprenants/${idApprenant}/stats`);
        setData(res.data);
      } catch (err) {
        console.error("Erreur API :", err);
      }
    };

    fetchStats();
  }, [idApprenant]); // ✅ plus de warning

  if (!data) return <p>Chargement des informations...</p>;

  return (
    <div>
      <h2>Bienvenue, {data.nom_apprenant}</h2>
      <p>Filière : {data.filiere}</p>
      <p>Niveau : {data.niveau}</p>
      <p>Formations en cours : {data.nb_formations}</p>
      <p>Accompagnements actifs : {data.nb_accompagnements}</p>
    </div>
  );
}

export default HomeApprenant;
