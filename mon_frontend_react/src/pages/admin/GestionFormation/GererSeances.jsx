import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../../../api/api";

export default function GererSeances() {
  const { idformation } = useParams();
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editSeance, setEditSeance] = useState(null);
  const [dateSeance, setDateSeance] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  // 🔹 Charger toutes les séances
  const fetchSeances = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/formations/${idformation}/seances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeances(res.data);
    } catch (err) {
      console.error(err);
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
  }, [idformation]);

  // 🔹 Ouvrir le dialog pour ajouter ou modifier
  const handleOpenDialog = (seance = null) => {
    setEditSeance(seance);
    setDateSeance(seance ? seance.date_seance : "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditSeance(null);
    setDateSeance("");
  };

  // 🔹 Ajouter ou modifier une séance
  const handleSaveSeance = async () => {
    try {
      if (!dateSeance) return;

      if (editSeance) {
        // Modifier
        await api.put(
          `/seances/${editSeance.idseance}`,
          { date_seance: dateSeance },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({ open: true, message: "Séance modifiée", severity: "success" });
      } else {
        // Ajouter
        await api.post(
          `/formations/${idformation}/seances`,
          { date_seance: dateSeance },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({ open: true, message: "Séance ajoutée", severity: "success" });
      }
      fetchSeances();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erreur serveur", severity: "error" });
    }
  };

  // 🔹 Supprimer une séance
  const handleDeleteSeance = async (idseance) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette séance ?")) return;
    try {
      await api.delete(`/seances/${idseance}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "Séance supprimée", severity: "success" });
      fetchSeances();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erreur serveur", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Séances de la formation {idformation}
      </Typography>

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Ajouter une séance
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : seances.length === 0 ? (
          <Typography align="center">Aucune séance programmée</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID Séance</b></TableCell>
                <TableCell><b>Date Séance</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seances.map((s) => (
                <TableRow key={s.idseance}>
                  <TableCell>{s.idseance}</TableCell>
                  <TableCell>{new Date(s.date_seance).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(s)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSeance(s.idseance)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Dialog Ajouter/Modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editSeance ? "Modifier séance" : "Ajouter séance"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Date de la séance"
            type="date"
            fullWidth
            value={dateSeance}
            onChange={(e) => setDateSeance(e.target.value)}
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveSeance}>
            {editSeance ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
