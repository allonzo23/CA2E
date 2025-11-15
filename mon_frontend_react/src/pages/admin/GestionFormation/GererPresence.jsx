import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Refresh, Edit, Delete } from "@mui/icons-material";
import api from "../../../api/api"; // 🔥 ton instance Axios

export default function GererPresence() {
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔹 Charger toutes les présences depuis le backend
  const fetchPresences = async () => {
    try {
      setLoading(true);
      const res = await api.get("/presence_seance/presences");
      setPresences(res.data);
    } catch (err) {
      console.error("Erreur chargement présences :", err);
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des présences",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresences();
  }, []);

  // 🔹 Supprimer une présence
  const handleDelete = async (idpresence) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette présence ?")) return;

    try {
      await api.delete(`/presence_seance/presences/${idpresence}`);
      setSnackbar({
        open: true,
        message: "Présence supprimée avec succès ✅",
        severity: "success",
      });
      fetchPresences();
    } catch (err) {
      console.error("Erreur suppression :", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression",
        severity: "error",
      });
    }
  };

  // 🔹 Modifier une présence (placeholder pour l’instant)
  const handleEdit = (idpresence) => {
    alert(`Fonction de modification pour la présence #${idpresence} à implémenter`);
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Liste des présences
      </Typography>

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchPresences}
        >
          Rafraîchir
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : presences.length === 0 ? (
          <Typography align="center">Aucune présence trouvée</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Apprenant</b></TableCell>
                <TableCell><b>Formation</b></TableCell>
                <TableCell><b>Date de séance</b></TableCell>
                <TableCell><b>Présent</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presences.map((p) => (
                <TableRow key={p.idpresence}>
                  <TableCell>{p.apprenant}</TableCell>
                  <TableCell>{p.formation}</TableCell>
                  <TableCell>
                    {new Date(p.date_seance).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{p.est_present ? "Oui" : "Non"}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(p.idpresence)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(p.idpresence)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ✅ Snackbar feedback */}
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
