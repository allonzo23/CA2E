import { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function ModifierApprenantModal({ isOpen, user, onClose, onUpdate }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    filiere: "",
    niveau: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        email: user.email || "",
        filiere: user.filiere || "",
        niveau: user.niveau || "",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoi au backend
      const token = localStorage.getItem("token");
      const res = await api.put(
      `/apprenants/update/${user.idutilisateur}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Mise à jour côté frontend
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Appelle la fonction parent (DashboardApprenant)
      onUpdate(updatedUser);

      // ✅ Redirection automatique vers le dashboard après mise à jour
      navigate("/apprenant/dashboard");

    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la modification !");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
        <h2>Modifier mes informations</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom :</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          <div>
            <label>Email :</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Filière :</label>
            <input type="text" name="filiere" value={formData.filiere} onChange={handleChange} />
          </div>
          <div>
            <label>Niveau :</label>
            <input type="text" name="niveau" value={formData.niveau} onChange={handleChange} />
          </div>
          <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
            <button type="submit" style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px" }}>
              Enregistrer
            </button>
            <button type="button" onClick={onClose} style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px" }}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierApprenantModal;
