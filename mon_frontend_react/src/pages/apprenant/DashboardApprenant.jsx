
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaSignOutAlt,
  FaUserEdit,
  FaQrcode,
} from "react-icons/fa";

import HomeApprenant from "./HomeApprenant";
import MesFormations from "./MesFormations";
import MesEvaluations from "./MesEvaluations";
import AccompagnementApprenant from "./AccompagnementApprenant";
import ModifierApprenantModal from "./ModifierApprenantModal";
import PresenceScan from "./PresenceScan";

import { useDashboard } from "../../context/DashboardContext";
import { getTabId } from "../../utils/tabId";

import "./DashboardApprenant.css";

export default function DashboardApprenant() {
  const navigate = useNavigate();
  const { state, updateUser, logout, loading } = useDashboard();

  const [modifierVisible, setModifierVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");

  const user = state.user;

  // ✅ Synchronisation du token à l'ouverture de l'onglet
  useEffect(() => {
    const tabId = getTabId();
    const token = sessionStorage.getItem(`token_${tabId}`);

    // Si token absent mais user existe dans state, on le remet dans sessionStorage
    if (!token && user && state.token) {
      sessionStorage.setItem(`token_${tabId}`, state.token);
      console.log("🔹 Token synchronisé pour cet onglet :", state.token);
    }
  }, [user, state.token]);

  // 🚦 Redirection si pas connecté
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const handleUpdateUser = (updatedUser) => {
    updateUser(updatedUser); // Met à jour DashboardContext + sessionStorage
    setModifierVisible(false);
  };

  if (loading || !user) return <p>Chargement du profil...</p>;

  const menuItems = [
    { key: "home", label: "Accueil", icon: <FaHome /> },
    { key: "mes-formations", label: "Mes Formations", icon: <FaBook /> },
    { key: "mes-evaluations", label: "Mes Évaluations", icon: <FaClipboardList /> },
    { key: "mes-accompagnements", label: "Mes Accompagnements", icon: <FaClipboardList /> },
    { key: "scanner-qr", label: "Scanner QR Code", icon: <FaQrcode /> },
  ];

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Apprenant</h2>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`sidebar-item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => setActiveMenu(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt className="icon" /> Déconnexion
        </button>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Tableau de bord Apprenant</h1>
          <button className="edit-btn" onClick={() => setModifierVisible(true)}>
            <FaUserEdit className="icon" /> Modifier mes infos
          </button>
        </header>

        <main className="dashboard-body">
          {activeMenu === "home" && <HomeApprenant user={user} />}
          {activeMenu === "mes-formations" && <MesFormations user={user} />}
          {activeMenu === "mes-evaluations" && <MesEvaluations user={user} />}
          {activeMenu === "mes-accompagnements" && <AccompagnementApprenant user={user} />}
          {activeMenu === "scanner-qr" && <PresenceScan />}
        </main>
      </div>

      {/* Modal de modification */}
      <ModifierApprenantModal
        isOpen={modifierVisible}
        user={user}
        onClose={() => setModifierVisible(false)}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}





/*
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaSignOutAlt,
  FaUserEdit,
  FaQrcode,
} from "react-icons/fa";

import HomeApprenant from "./HomeApprenant";
import MesFormations from "./MesFormations";
import MesEvaluations from "./MesEvaluations";
import AccompagnementApprenant from "./AccompagnementApprenant";
import ModifierApprenantModal from "./ModifierApprenantModal";
import PresenceScan from "./PresenceScan"; // Import du scanner QR

import "./DashboardApprenant.css";

function DashboardApprenant() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");
  const [user, setUser] = useState(null);
  const [modifierVisible, setModifierVisible] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (!storedUserData) {
      navigate("/login");
      return;
    }

    try {
      const storedUser = JSON.parse(storedUserData);
      setUser(storedUser);
    } catch (error) {
      console.error("Erreur lors du chargement du user :", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setModifierVisible(false);
  };

  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- }
      <aside className="sidebar">
        <h2 className="sidebar-title">Apprenant</h2>
        <ul className="sidebar-menu">
          {[
            { key: "home", label: "Accueil", icon: <FaHome /> },
            { key: "mes-formations", label: "Mes Formations", icon: <FaBook /> },
            { key: "mes-evaluations", label: "Mes Évaluations", icon: <FaClipboardList /> },
            { key: "mes-accompagnements", label: "Mes Accompagnements", icon: <FaClipboardList /> },
            { key: "scanner-qr", label: "Scanner QR Code", icon: <FaQrcode /> },
          ].map((item) => (
            <li
              key={item.key}
              className={`sidebar-item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => setActiveMenu(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Déconnexion
        </button>
      </aside>

      {/* --- CONTENU PRINCIPAL --- }
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Tableau de bord Apprenant</h1>
          <button className="edit-btn" onClick={() => setModifierVisible(true)}>
            <FaUserEdit className="icon" /> Modifier mes infos
          </button>
        </header>

        <main className="dashboard-body">
          {activeMenu === "home" && <HomeApprenant user={user} />}
          {activeMenu === "mes-formations" && <MesFormations user={user} />}
          {activeMenu === "mes-evaluations" && <MesEvaluations user={user} />}
          {activeMenu === "mes-accompagnements" && (
            <AccompagnementApprenant user={user} />
          )}
          {activeMenu === "scanner-qr" && <PresenceScan />} {/* Affichage du scanner }
        </main>
      </div>

      {/* Modal de modification }
      <ModifierApprenantModal
        isOpen={modifierVisible}
        user={user}
        onClose={() => setModifierVisible(false)}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}

export default DashboardApprenant;
*/