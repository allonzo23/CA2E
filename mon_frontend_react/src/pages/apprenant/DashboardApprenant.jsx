import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaSignOutAlt,
  FaUserEdit,
  FaQrcode,
  FaBars,
  FaTimes,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = state.user;

  // Synchronisation du token à l'ouverture de l'onglet
  useEffect(() => {
    const tabId = getTabId();
    const token = sessionStorage.getItem(`token_${tabId}`);

    if (!token && user && state.token) {
      sessionStorage.setItem(`token_${tabId}`, state.token);
      console.log("🔹 Token synchronisé pour cet onglet :", state.token);
    }
  }, [user, state.token]);

  // Redirection si pas connecté
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Fermer la sidebar mobile lors du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Désactiver le scroll du body quand la sidebar mobile est ouverte
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Gestion du changement de menu
  const handleMenuClick = (key) => {
    setActiveMenu(key);
    setSidebarOpen(false);
  };

  // Mise à jour du profil utilisateur
  const handleUpdateUser = (updatedUser) => {
    updateUser(updatedUser);
    setModifierVisible(false);
  };

  // Affichage du chargement
  if (loading || !user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  // Définition des éléments du menu
  const menuItems = [
    { key: "home", label: "Accueil", icon: <FaHome /> },
    { key: "mes-formations", label: "Mes Formations", icon: <FaBook /> },
    { 
      key: "mes-evaluations", 
      label: "Mes Évaluations", 
      icon: <FaClipboardList /> 
    },
    { 
      key: "mes-accompagnements", 
      label: "Mes Accompagnements", 
      icon: <FaClipboardList /> 
    },
    { key: "scanner-qr", label: "Scanner QR Code", icon: <FaQrcode /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Apprentis</h2>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav aria-label="Menu principal">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`sidebar-item ${
                    activeMenu === item.key ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick(item.key)}
                  aria-current={activeMenu === item.key ? "page" : undefined}
                >
                  <span className="icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button 
          className="logout-btn" 
          onClick={logout}
          aria-label="Se déconnecter"
          title="Déconnexion"
        >
          <FaSignOutAlt aria-hidden="true" />
        </button>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={sidebarOpen}
            >
              <FaBars />
            </button>
            <h1>Tableau de bord Apprenant</h1>
          </div>
          
          <button 
            className="edit-btn" 
            onClick={() => setModifierVisible(true)}
            aria-label="Modifier mes informations"
          >
            <FaUserEdit className="icon" aria-hidden="true" /> 
            <span className="edit-btn-text">Modifier mes infos</span>
          </button>
        </header>

        <main className="dashboard-body">
          {activeMenu === "home" && <HomeApprenant user={user} />}
          {activeMenu === "mes-formations" && <MesFormations user={user} />}
          {activeMenu === "mes-evaluations" && <MesEvaluations user={user} />}
          {activeMenu === "mes-accompagnements" && (
            <AccompagnementApprenant user={user} />
          )}
          {activeMenu === "scanner-qr" && <PresenceScan />}
        </main>
      </div>

      {/* Modal de modification du profil */}
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