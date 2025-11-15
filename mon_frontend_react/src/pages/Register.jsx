// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
//import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [idrole, setIdrole] = useState(1); // 1=Apprenant, 2=Formateur, 3=Admin
  const [extra, setExtra] = useState({ filiere: "", niveau: "", specialite: "", poste: "" });
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Préparer l'objet extra selon le rôle
      let extraData = {};
      if (idrole === 1) extraData = { filiere: extra.filiere, niveau: extra.niveau };
      else if (idrole === 2) extraData = { specialite: extra.specialite };
      else if (idrole === 3) extraData = { poste: extra.poste };

      const response = await api.post("/auth/register" ,
        { nom, email, motdepasse, idrole, extra: extraData }
      );

      console.log("Inscription réussie :", response.data);

      // Redirection automatique selon le rôle
      switch (idrole) {
        case 1:
          navigate("/dashboard/apprenant");
          break;
        case 2:
          navigate("/dashboard/formateur");
          break;
        case 3:
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      console.error("Erreur backend :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Créer un compte</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            placeholder="Nom complet"
          />
        </div>

        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
            required
            placeholder="Mot de passe"
          />
        </div>

        <div>
          <label>Rôle :</label>
          <select value={idrole} onChange={(e) => setIdrole(parseInt(e.target.value))}>
            <option value={1}>Apprenant</option>
            <option value={2}>Formateur</option>
            <option value={3}>Administrateur</option>
          </select>
        </div>

        {/* Champs dynamiques selon le rôle */}
        {idrole === 1 && (
          <>
            <div>
              <label>Filière :</label>
              <input
                type="text"
                value={extra.filiere}
                onChange={(e) => setExtra({ ...extra, filiere: e.target.value })}
                required
                placeholder="Ex : Informatique"
              />
            </div>
            <div>
              <label>Niveau :</label>
              <input
                type="text"
                value={extra.niveau}
                onChange={(e) => setExtra({ ...extra, niveau: e.target.value })}
                required
                placeholder="Ex : L2"
              />
            </div>
          </>
        )}

        {idrole === 2 && (
          <div>
            <label>Spécialité :</label>
            <input
              type="text"
              value={extra.specialite}
              onChange={(e) => setExtra({ ...extra, specialite: e.target.value })}
              required
              placeholder="Ex : Marketing"
            />
          </div>
        )}

        {idrole === 3 && (
          <div>
            <label>Poste :</label>
            <input
              type="text"
              value={extra.poste}
              onChange={(e) => setExtra({ ...extra, poste: e.target.value })}
              required
              placeholder="Ex : Responsable RH"
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: "10px" }}>
          Créer un compte
        </button>
      </form>

      {/* Lien vers login */}
      <p style={{ marginTop: "15px" }}>
        Déjà un compte ?{" "}
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Se connecter
        </button>
      </p>
    </div>
  );
}

export default Register;




/*
import React from "react";

const Register = () => {
  return (
    <div>
      <h1>Register</h1>
      <p>Formulaire d'inscription ici...</p>
    </div>
  );
};

export default Register;
*/
