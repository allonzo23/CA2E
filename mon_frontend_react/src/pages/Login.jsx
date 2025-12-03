import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useDashboard } from "../context/DashboardContext";

function Login() {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useDashboard();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, motdepasse });

      console.log("✅ Réponse backend :", response.data);

      const utilisateur = response.data.utilisateur;
      const token = response.data.token;

      if (!utilisateur || !token) {
        setError("Réponse invalide du serveur.");
        return;
      }

      // 🔹 Harmonisation du format attendu dans tout le projet
      const user = {
        ...utilisateur,
        nomrole: utilisateur.nomrole || utilisateur.role || "",
        idformateur: utilisateur.idutilisateur, // 🔹 permet d’unifier les usages
      };
  
      localStorage.setItem("token", token);
      // ✅ Met à jour le DashboardContext + sessionStorage
      updateUser(user, token);

      console.log("Utilisateur connecté :", user);
      // 🔹 Redirection selon le rôle
      const role = user.nomrole?.toLowerCase();

      if (role === "apprenant") {
        navigate("/apprenant/dashboard");
      } else if (role === "formateur") {
        navigate("/formateur/dashboard");
      } else if (role === "administrateur") {
        navigate("/admin/dashboard");
      } else {
        setError("Rôle non reconnu. Contactez un administrateur.");
      }
    } catch (err) {
      console.error("❌ Erreur backend :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", color: "black" }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
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
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "#4a90e2",
            color: "yellow",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Pas encore de compte ?{" "}
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "#4a90e2",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Créer un compte
        </button>
      </p>
    </div>
  );
}

export default Login;



/*
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useDashboard } from "../context/DashboardContext";

function Login() {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useDashboard(); // ✅ Utilisation DashboardContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, motdepasse });

      // 🔹 Log pour debug
      console.log("Réponse backend :", response.data);

      const user = response.data.utilisateur;
      const token = response.data.token;

      if (!user || !token) {
        setError("Réponse invalide du serveur.");
        return;
      }

      // ✅ Stockage utilisateur et token via DashboardContext (isolé par onglet)
      updateUser(user); // `updateUser` gère sessionStorage avec TAB_ID
      sessionStorage.setItem(`token_${window.sessionStorage.getItem("TAB_ID")}`, token);

      // Redirection selon rôle
      switch (user.nomrole.toLowerCase()) {
        case "apprenant":
          navigate("/apprenant/dashboard");
          break;
        case "formateur":
          navigate("/formateur/dashboard");
          break;
        case "administrateur":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      console.error("Erreur backend :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", color: "black" }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
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
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Pas encore de compte ?{" "}
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "#4a90e2",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Créer un compte
        </button>
      </p>
    </div>
  );
}

export default Login;
*/
