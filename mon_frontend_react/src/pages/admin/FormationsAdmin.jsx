import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import {
  Assignment,
  CheckCircle,
  AddCircleOutline,
  ListAlt, // 👈 icône pour la liste des formations
} from "@mui/icons-material";
import DemandesEnAttente from "./GestionFormation/DemandesEnAttente";
import FormationsConfirmees from "./GestionFormation/FormationsConfirmees";
import Seance from "./GestionFormation/Seance";
import TousFormations from "./GestionFormation/TousFormations";

const drawerWidth = 80;

export default function GestionFormations() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <DemandesEnAttente />;
      case 1:
        return <FormationsConfirmees />;
      case 2:
        return <Seance />;
      case 3:
        return <TousFormations />;
      default:
        return <Typography>Section non trouvée</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar verticale */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1976d2",
            color: "white",
          },
        }}
      >
        <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
          <Typography variant="h6">Admin</Typography>
        </Box>
        <List>
          <Tooltip title="Demandes en attente" placement="right">
            <ListItemButton
              selected={selectedTab === 0}
              onClick={() => setSelectedTab(0)}
            >
              <ListItemIcon sx={{ color: "white", justifyContent: "center" }}>
                <Assignment />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>

          <Tooltip title="Formations confirmées" placement="right">
            <ListItemButton
              selected={selectedTab === 1}
              onClick={() => setSelectedTab(1)}
            >
              <ListItemIcon sx={{ color: "white", justifyContent: "center" }}>
                <CheckCircle />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>

          {/* ✅ Changement ici : "Créer formation" devient "Séance" */}
          <Tooltip title="Séance" placement="right">
            <ListItemButton
              selected={selectedTab === 2}
              onClick={() => setSelectedTab(2)}
            >
              <ListItemIcon sx={{ color: "white", justifyContent: "center" }}>
                <AddCircleOutline />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>

          {/* 🔥 Ajout du nouveau bouton */}
          <Tooltip title="Liste des formations" placement="right">
            <ListItemButton
              selected={selectedTab === 3}
              onClick={() => setSelectedTab(3)}
            >
              <ListItemIcon sx={{ color: "white", justifyContent: "center" }}>
                <ListAlt />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </List>
      </Drawer>

      {/* Contenu principal */}
      <Box sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mb: 3,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
            },
            "& .MuiTabs-indicator": {
              height: "4px",
              borderRadius: "2px",
            },
          }}
        >
          <Tab label="Demandes en attente" />
          <Tab label="Formations confirmées" />
          <Tab label="Séance et présence" /> {/* ✅ remplacé ici */}
          <Tab label="Liste de formation" />
        </Tabs>

        {renderContent()}
      </Box>
    </Box>
  );
}
