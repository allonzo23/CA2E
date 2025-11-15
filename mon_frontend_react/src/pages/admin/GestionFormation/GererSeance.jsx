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

export default function GererSeance() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔹 Charger toutes les séances depuis le backend
  const fetchSeances = async () => {
    try {
      setLoading(true);
      const res = await api.get("/presence_seance/seances/tous");
      setSeances(res.data);
    } catch (err) {
      console.error("Erreur chargement séances :", err);
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des séances",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeances();
  }, []);

  // 🔹 Supprimer une séance
  const handleDelete = async (idseance) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette séance ?")) return;

    try {
      await api.delete(`/presence_seance/seances/${idseance}`);
      setSnackbar({
        open: true,
        message: "Séance supprimée avec succès ✅",
        severity: "success",
      });
      fetchSeances();
    } catch (err) {
      console.error("Erreur suppression :", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression",
        severity: "error",
      });
    }
  };

  // 🔹 Modifier une séance (ici juste placeholder pour l’instant)
  const handleEdit = (idseance) => {
    alert(`Fonction de modification pour la séance #${idseance} à implémenter`);
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Liste des séances
      </Typography>

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchSeances}
        >
          Rafraîchir
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : seances.length === 0 ? (
          <Typography align="center">Aucune séance trouvée</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Formation</b></TableCell>
                <TableCell><b>Date de séance</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seances.map((s) => (
                <TableRow key={s.idseance}>
                  <TableCell>{s.formation}</TableCell>
                  <TableCell>
                    {new Date(s.date_seance).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(s.idseance)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(s.idseance)}
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
