// src/pages/admin/UsersAdmin.jsx
import { useState } from "react";
import { Tabs, Tab, Box, useMediaQuery, useTheme } from "@mui/material";
import ApprenantAdmin from "./users/ApprenantAdmin";
import FormateurAdmin from "./users/FormateurAdmin";
import AdminAdmin from "./users/AdminAdmin";

export default function UsersAdmin() {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // détecte mobile

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant={isMobile ? "scrollable" : "fullWidth"} // scrollable sur mobile
        scrollButtons="auto"                             // affiche boutons de scroll si besoin
        textColor="primary"
        indicatorColor="primary"
        sx={{
          "& .MuiTab-root": {
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "16px",
            px: 3,
          },
          "& .MuiTabs-indicator": {
            height: "4px",
            borderRadius: "2px",
          },
        }}
      >
        <Tab label="Apprenants" />
        <Tab label="Formateurs" />
        <Tab label="Admins" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <ApprenantAdmin />}
        {tabIndex === 1 && <FormateurAdmin />}
        {tabIndex === 2 && <AdminAdmin />}
      </Box>
    </Box>
  );
}
