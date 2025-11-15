import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../../api/api";

export default function CreerFormation() {
  const [titre, setTitre] = useState("");
  const [formateur, setFormateur] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/formations",
        { titre, formateur, dateDebut, dateFin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: "Formation créée avec succès", severity: "success" });
      // Réinitialiser le formulaire
      setTitre(""); 
      setFormateur(""); 
      setDateDebut(""); 
      setDateFin("");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erreur lors de la création", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h5" gutterBottom>
        Créer une nouvelle formation
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Titre de la formation"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
        <TextField
          label="Nom du formateur"
          value={formateur}
          onChange={(e) => setFormateur(e.target.value)}
          required
        />
        <TextField
          label="Date début"
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Date fin"
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Créer
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
