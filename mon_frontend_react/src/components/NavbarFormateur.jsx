import React from "react";

const NavbarFormateur = () => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav>
      <h3>Formateur Navbar</h3>
      <button onClick={handleLogout}>Déconnexion</button>
    </nav>
  );
};

export default NavbarFormateur;