// src/components/apprenant/AccompagnementApprenant.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api"; // <-- si tu as un api axios configuré

function AccompagnementApprenant({ user }) {
  const [accompagnements, setAccompagnements] = useState([]);

  useEffect(() => {
    const fetchAccompagnements = async () => {
      try {
        const response = await api.get(`/accompagnements/${user.id}`); // <-- adapter selon ton backend
        setAccompagnements(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des accompagnements :", error);
      }
    };

    if (user?.id) fetchAccompagnements();
  }, [user]);

  return (
    <div>
      <h2>Mes Accompagnements</h2>
      {accompagnements.length === 0 ? (
        <p>Aucun accompagnement disponible.</p>
      ) : (
        <ul>
          {accompagnements.map((acc) => (
            <li key={acc.id}>
              {acc.titre} - {acc.dateDebut} à {acc.dateFin}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AccompagnementApprenant;
