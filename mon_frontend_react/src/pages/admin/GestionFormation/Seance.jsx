import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import GererSeance from "./GererSeance";
import GererPresence from "./GererPresence";

export default function Seance() {
  const [selectedView, setSelectedView] = useState("seance"); // "seance" ou "presence"

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Gestion des séances
      </Typography>

      {/* Boutons de sélection */}
      <Stack direction="row" spacing={2} mb={4}>
        <Button
          variant={selectedView === "seance" ? "contained" : "outlined"}
          onClick={() => setSelectedView("seance")}
        >
          Gérer séance
        </Button>
        <Button
          variant={selectedView === "presence" ? "contained" : "outlined"}
          onClick={() => setSelectedView("presence")}
        >
          Gérer présence
        </Button>
      </Stack>

      {/* Contenu dynamique */}
      {selectedView === "seance" ? <GererSeance /> : <GererPresence />}
    </Box>
  );
}
