// src/components/NavbarAdmin.jsx
// src/components/NavbarAdmin.jsx
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        height: "60px",
        backgroundColor: "#2c3e50",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>Admin Dashboard</div>

      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#e74c3c",
          border: "none",
          padding: "8px 12px",
          borderRadius: "5px",
          cursor: "pointer",
          color: "white",
          fontWeight: "bold",
        }}
      >
        <FaSignOutAlt style={{ marginRight: "8px" }} />
        Déconnexion
      </button>
    </nav>
  );
}

export default NavbarAdmin;



/*
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        height: "60px",
        backgroundColor: "#2c3e50",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Titre ou logo }
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>Admin Dashboard</div>

      {/* Bouton de déconnexion }
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#e74c3c",
          border: "none",
          padding: "8px 12px",
          borderRadius: "5px",
          cursor: "pointer",
          color: "white",
          fontWeight: "bold",
        }}
      >
        <FaSignOutAlt style={{ marginRight: "8px" }} />
        Déconnexion
      </button>
    </nav>
  );
}

export default NavbarAdmin;





import React from "react";

const NavbarAdmin = () => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav>
      <h3>Admin Navbar</h3>
      <button onClick={handleLogout}>Déconnexion</button>
    </nav>
  );
};


export default NavbarAdmin;
*/
