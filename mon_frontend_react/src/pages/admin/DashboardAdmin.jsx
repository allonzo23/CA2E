// src/pages/admin/DashboardAdmin.jsx
import React, { useEffect } from "react";
import { DashboardProvider, useDashboard } from "../../context/DashboardContext";
import HandshakeIcon from '@mui/icons-material/Handshake';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, Button, CssBaseline, Divider, useMediaQuery
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon, Home as HomeIcon, People as PeopleIcon, Book as BookIcon,
  Assignment as AssignmentIcon, Settings as SettingsIcon, Logout as LogoutIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import HomeAdmin from "./HomeAdmin";
import UsersAdmin from "./UsersAdmin";
import FormationsAdmin from "./FormationsAdmin";
import AccompagnementAdmin from "./AccompagnementAdmin";
import EvaluationsAdmin from "./EvaluationsAdmin";
import SettingsAdmin from "./SettingsAdmin";

import { getTabId } from "../../utils/tabId";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: { main: "#1a237e" },
    secondary: { main: "#fbc02d" },
    background: { default: "#f4f6f8" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

function DashboardAdminContent() {
  const { state, updateMenu, logout } = useDashboard();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  // 🔹 Synchronisation du token multi-onglet
  useEffect(() => {
    const tabId = getTabId();
    const token = sessionStorage.getItem(`token_${tabId}`);
    if (!token && state.token) {
      sessionStorage.setItem(`token_${tabId}`, state.token);
      console.log("🔹 Token synchronisé pour cet onglet (Admin) :", state.token);
    }
  }, [state.token]);

  console.log("DashboardAdmin - token actuel :", state.token);

  const menuItems = [
    { key: "home", label: "Accueil", icon: <HomeIcon /> },
    { key: "users", label: "Utilisateurs", icon: <PeopleIcon /> },
    { key: "formations", label: "Formations", icon: <BookIcon /> },
    { key: "accompagnements", label: "Accompagnement", icon: <HandshakeIcon /> },
    { key: "evaluations", label: "Évaluations", icon: <AssignmentIcon /> },
    { key: "settings", label: "Paramètres", icon: <SettingsIcon /> },
  ];

  const handleDrawerToggle = () => updateMenu("toggleDrawer");
  const handleLogout = () => { logout(); navigate("/login"); };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: "white", ml: 1 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.key}
            selected={state.activeMenu === item.key}
            onClick={() => updateMenu(item.key)}
            sx={{
              "&.Mui-selected": {
                bgcolor: "secondary.main",
                color: "black",
                "& .MuiListItemIcon-root": { color: "black" },
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "primary.main"
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Tableau de bord Administrateur
            </Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "primary.main", color: "white" },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.activeMenu}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              {state.activeMenu === "home" && <HomeAdmin />}
              {state.activeMenu === "users" && <UsersAdmin />}
              {state.activeMenu === "formations" && <FormationsAdmin />}
              {state.activeMenu === "accompagnements" && <AccompagnementAdmin />}
              {state.activeMenu === "evaluations" && <EvaluationsAdmin />}
              {state.activeMenu === "settings" && <SettingsAdmin />}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// 🔹 Provider pour que useDashboard fonctionne
export default function DashboardAdmin() {
  return (
    <DashboardProvider>
      <DashboardAdminContent />
    </DashboardProvider>
  );
}




/*
import { useDashboard } from "../../context/DashboardContext";
import { Box, CssBaseline, Button } from "@mui/material";
import HomeAdmin from "./HomeAdmin";
import UsersAdmin from "./UsersAdmin";
import FormationsAdmin from "./FormationsAdmin";
import EvaluationsAdmin from "./EvaluationsAdmin";
import SettingsAdmin from "./SettingsAdmin";

export default function DashboardAdmin() {
  const { state, updateMenu, logout } = useDashboard();

  const menuItems = [
    { key: "home", label: "Accueil", component: <HomeAdmin /> },
    { key: "users", label: "Utilisateurs", component: <UsersAdmin /> },
    { key: "formations", label: "Formations", component: <FormationsAdmin /> },
    { key: "evaluations", label: "Évaluations", component: <EvaluationsAdmin /> },
    { key: "settings", label: "Paramètres", component: <SettingsAdmin /> },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <aside style={{ width: 240, backgroundColor: "#1a237e", color: "white" }}>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              style={{ backgroundColor: state.activeMenu === item.key ? "#fbc02d" : "transparent" }}
              onClick={() => updateMenu(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <Button onClick={logout}>Déconnexion</Button>
      </aside>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {menuItems.find((item) => item.key === state.activeMenu)?.component}
      </Box>
    </Box>
  );
}






/*
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  CssBaseline,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HomeAdmin from "./HomeAdmin";
import UsersAdmin from "./UsersAdmin";
import FormationsAdmin from "./FormationsAdmin";
import EvaluationsAdmin from "./EvaluationsAdmin";
import SettingsAdmin from "./SettingsAdmin";



const drawerWidth = 240;

// 🎨 Thème MUI
const theme = createTheme({
  palette: {
    primary: { main: "#1a237e" },
    secondary: { main: "#fbc02d" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default function DashboardAdmin() {
  const [activeMenu, setActiveMenu] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Détection mobile (Drawer temporaire sur mobile)
  const isMobile = useMediaQuery("(max-width:900px)");

  const menuItems = [
    { key: "home", label: "Accueil", icon: <HomeIcon /> },
    { key: "users", label: "Utilisateurs", icon: <PeopleIcon /> },
    { key: "formations", label: "Formations", icon: <BookIcon /> },
    { key: "evaluations", label: "Évaluations", icon: <AssignmentIcon /> },
    { key: "settings", label: "Paramètres", icon: <SettingsIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 📦 Contenu du Drawer
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: "white", ml: 1 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.key}
            selected={activeMenu === item.key}
            onClick={() => {
              setActiveMenu(item.key);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              "&.Mui-selected": {
                bgcolor: "secondary.main",
                color: "black",
                "& .MuiListItemIcon-root": { color: "black" },
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* ✅ BARRE SUPÉRIEURE }
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "primary.main",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Tableau de bord Admin
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>

        {/* ✅ DRAWER (Menu latéral) }
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Drawer Mobile }
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                bgcolor: "primary.main",
                color: "white",
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Drawer Desktop (Persistant) }
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                bgcolor: "primary.main",
                color: "white",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* ✅ CONTENU PRINCIPAL }
        <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    mt: 8,
  }}
>
  <AnimatePresence mode="wait">
    <motion.div
      key={activeMenu} // clé unique = nouvelle animation à chaque changement
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {activeMenu === "home" && <HomeAdmin />}
      {activeMenu === "users" && <UsersAdmin />}
      {activeMenu === "formations" && <FormationsAdmin />}
      {activeMenu === "evaluations" && <EvaluationsAdmin />}
      {activeMenu === "settings" && <SettingsAdmin />}
    </motion.div>
  </AnimatePresence>
</Box>

      </Box>
    </ThemeProvider>
  );
}






/*
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaBook, FaClipboardList, FaCog, FaSignOutAlt } from "react-icons/fa";

function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { key: "home", label: "Accueil", icon: <FaHome /> },
    { key: "users", label: "Gestion Utilisateurs", icon: <FaUsers /> },
    { key: "formations", label: "Formations", icon: <FaBook /> },
    { key: "evaluations", label: "Évaluations", icon: <FaClipboardList /> },
    { key: "settings", label: "Paramètres", icon: <FaCog /> },
  ];

  return (
    <div className="admin-dashboard" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar }
      <aside
        className="sidebar"
        style={{
          width: "220px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 className="sidebar-title" style={{ marginBottom: "30px" }}>Admin Panel</h2>
        <ul className="menu" style={{ padding: 0 }}>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={activeMenu === item.key ? "active" : ""}
              onClick={() => setActiveMenu(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: activeMenu === item.key ? "#34495e" : "transparent",
                marginBottom: "5px",
                borderRadius: "5px",
              }}
            >
              <span style={{ marginRight: "10px" }}>{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
        {/* Bouton déconnexion }
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            padding: "10px",
            width: "100%",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt style={{ marginRight: "10px" }} />
          Déconnexion
        </button>
      </aside>

      {/* Main content }
      <div className="main-content" style={{ flex: 1, padding: "20px" }}>
        <header className="admin-header" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Dashboard Administrateur</h1>
        </header>

        <section className="content">
          {activeMenu === "home" && <p>Bienvenue dans le tableau de bord admin !</p>}
          {activeMenu === "users" && <p>Gérer les utilisateurs ici...</p>}
          {activeMenu === "formations" && <p>Gérer les formations ici...</p>}
          {activeMenu === "evaluations" && <p>Gérer les évaluations ici...</p>}
          {activeMenu === "settings" && <p>Paramètres de l'application...</p>}
        </section>
      </div>
    </div>
  );
}

export default DashboardAdmin;

*/



/*
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */
      /*
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="menu">
          <li
            className={activeMenu === "home" ? "active" : ""}
            onClick={() => setActiveMenu("home")}
          >
            Accueil
          </li>
          <li
            className={activeMenu === "users" ? "active" : ""}
            onClick={() => setActiveMenu("users")}
          >
            Gestion Utilisateurs
          </li>
          <li
            className={activeMenu === "formations" ? "active" : ""}
            onClick={() => setActiveMenu("formations")}
          >
            Formations
          </li>
          <li
            className={activeMenu === "evaluations" ? "active" : ""}
            onClick={() => setActiveMenu("evaluations")}
          >
            Évaluations
          </li>
          <li
            className={activeMenu === "settings" ? "active" : ""}
            onClick={() => setActiveMenu("settings")}
          >
            Paramètres
          </li>
        </ul>
      </aside>

      {/* Main content */
      /*
      <div className="main-content">
        <header className="admin-header">
          <h1>Dashboard Administrateur</h1>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </header>

        <section className="content">
          {activeMenu === "home" && <p>Bienvenue dans le tableau de bord admin !</p>}
          {activeMenu === "users" && <p>Gérer les utilisateurs ici...</p>}
          {activeMenu === "formations" && <p>Gérer les formations ici...</p>}
          {activeMenu === "evaluations" && <p>Gérer les évaluations ici...</p>}
          {activeMenu === "settings" && <p>Paramètres de l'application...</p>}
        </section>
      </div>
    </div>
  );
}

export default DashboardAdmin;



/*
import React from "react";
import NavbarAdmin from "../../components/NavbarAdmin";

const DashboardAdmin = () => {
  return (
    <>
      <NavbarAdmin />
      <h2>Bienvenue sur le Dashboard Admin</h2>
    </>
  );
};

export default DashboardAdmin;
*/