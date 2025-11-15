// src/pages/admin/DashboardFormateur.jsx
import React from "react";
import { useDashboard } from "../../context/DashboardContext";
import HandshakeIcon from "@mui/icons-material/Handshake";
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
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import HomeFormateur from "./HomeFormateur";
import FormateurFormation from "./FormateurFormation";
import FormateurEvaluation from "./FormateurEvaluation";
import FormateurApprenants from "./FormateurApprenants";
import FormateurSeancePresence from "./FormateurSeancePresence";
import FormateurAccompagnement from "./FormateurAccompagnement";

const drawerWidth = 240;

// 🎨 Nouveau thème personnalisé
const theme = createTheme({
  palette: {
    primary: { main: "#2c3e50" }, // Bleu foncé
    secondary: { main: "#ffffff" }, // Blanc
    background: { default: "#f8f9fa" }, // Gris très clair pour le fond
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

function DashboardFormateur() {
  const { state, updateMenu, logout } = useDashboard();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const user = state.user;

  const menuItems = [
    { key: "home", label: "Accueil", icon: <HomeIcon /> },
    { key: "mes-formations", label: "Mes Formations", icon: <BookIcon /> },
    { key: "mes-evaluations", label: "Mes Évaluations", icon: <AssignmentIcon /> },
    { key: "mes-apprenants", label: "Mes Apprenants", icon: <PeopleIcon /> },
    { key: "seances-presences", label: "Séances & Présences", icon: <AssignmentIcon /> },
    { key: "accompagnements", label: "Accompagnement", icon: <HandshakeIcon /> },
  ];

  const handleDrawerToggle = () => updateMenu("toggleDrawer");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: "white", ml: 1 }}>
          Tableau de bord formateur
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
                color: "#2c3e50",
                "& .MuiListItemIcon-root": { color: "#2c3e50" },
              },
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
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

        {/* 🔷 Barre du haut */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Tableau de bord Formateur
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                border: "1px solid white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>

        {/* 🔹 Menu latéral */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
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

        {/* 🔸 Contenu principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
            bgcolor: "background.default",
            minHeight: "100vh",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={state.activeMenu}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              {state.activeMenu === "home" && <HomeFormateur user={user} />}
              {state.activeMenu === "mes-formations" && <FormateurFormation user={user} />}
              {state.activeMenu === "mes-evaluations" && <FormateurEvaluation user={user} />}
              {state.activeMenu === "mes-apprenants" && <FormateurApprenants user={user} />}
              {state.activeMenu === "seances-presences" && <FormateurSeancePresence user={user} />}
              {state.activeMenu === "accompagnements" && <FormateurAccompagnement user={user} />}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function DashboardAdmin() {
  return <DashboardFormateur />;
}





/*
import React from "react";
import { useDashboard } from "../../context/DashboardContext";
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
  Book as BookIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Handshake as HandshakeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import HomeFormateur from "./HomeFormateur";
import FormateurFormation from "./FormateurFormation";
import FormateurEvaluation from "./FormateurEvaluation";
import FormateurApprenants from "./FormateurApprenants";
import FormateurSeancePresence from "./FormateurSeancePresence";
import FormateurAccompagnement from "./FormateurAccompagnement";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: { main: "#2c3e50" },
    secondary: { main: "#34495e" },
    background: { default: "#f4f6f8" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

function DashboardFormateur() {
  const { state, updateMenu, logout, loading } = useDashboard();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const user = state.user;

  // 🚦 Redirection si pas connecté
  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading || !user) return <p>Chargement du profil...</p>;

  const idFormateur = user.idutilisateur;
  const selectedSeance = 1; // à adapter dynamiquement si besoin

  const menuItems = [
    { key: "home", label: "Accueil", icon: <HomeIcon /> },
    { key: "mes-formations", label: "Mes Formations", icon: <BookIcon /> },
    { key: "mes-evaluations", label: "Mes Évaluations", icon: <AssignmentIcon /> },
    { key: "mes-apprenants", label: "Mes Apprenants", icon: <PeopleIcon /> },
    { key: "seances-presences", label: "Séances & Présences", icon: <AssignmentIcon /> },
    { key: "accompagnements", label: "Accompagnement", icon: <HandshakeIcon /> },
  ];

  const handleDrawerToggle = () => updateMenu("toggleDrawer");

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: "white", ml: 1 }}>
          Formateur Panel
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
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Button
        variant="contained"
        sx={{ mt: 2, width: "90%", ml: 1 }}
        onClick={() => navigate(`/formateur/qrcode/${selectedSeance}`)}
      >
        Afficher QR code
      </Button>
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
              Tableau de bord Formateur
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
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
              key={state.activeMenu}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              {state.activeMenu === "home" && <HomeFormateur />}
              {state.activeMenu === "mes-formations" && <FormateurFormation />}
              {state.activeMenu === "mes-evaluations" && (
                <FormateurEvaluation idformateur={idFormateur} />
              )}
              {state.activeMenu === "mes-apprenants" && <FormateurApprenants />}
              {state.activeMenu === "seances-presences" && <FormateurSeancePresence />}
              {state.activeMenu === "accompagnements" && (
                <FormateurAccompagnement idformateur={idFormateur} />
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DashboardFormateur;
*/