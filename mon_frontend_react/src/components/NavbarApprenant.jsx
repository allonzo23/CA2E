// NavbarApprenant.jsx
import React from "react";

const NavbarApprenant = () => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav>
      <h3>Apprenant Navbar</h3>
      <button onClick={handleLogout}>Déconnexion</button>
    </nav>
  );
};

export default NavbarApprenant;

