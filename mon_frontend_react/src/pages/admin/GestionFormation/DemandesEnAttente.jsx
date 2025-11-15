import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Button, Paper, CircularProgress, Stack, Snackbar, Alert,
} from "@mui/material";
import { Check, Close, Refresh } from "@mui/icons-material";
import api from "../../../api/api";
import { useDashboard } from "../../../context/DashboardContext";

export default function DemandesEnAttente() {
  const { state } = useDashboard();
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleRefresh = async () => {
    if (!state.token) return;
    try {
      setLoading(true);
      const res = await api.get("/inscriptions/pending");
      setInscriptions(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erreur lors du rafraîchissement", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id, statut) => {
    if (!state.token) return;
    try {
      await api.patch(`/inscriptions/${id}/statut`, { statut });
      setSnackbar({ open: true, message: `Inscription ${statut}`, severity: "success" });
      handleRefresh();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erreur lors de la mise à jour", severity: "error" });
    }
  };

  useEffect(() => { handleRefresh(); }, [state.token]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Demandes d’inscription en attente</Typography>

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh}>
          Rafraîchir la liste
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : inscriptions.length === 0 ? (
          <Typography align="center">Aucune demande en attente</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Apprenant</b></TableCell>
                <TableCell><b>Formation</b></TableCell>
                <TableCell><b>Date d’inscription</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inscriptions.map((i) => (
                <TableRow key={i.idinscription}>
                  <TableCell>{i.nom_apprenant}</TableCell>
                  <TableCell>{i.titre_formation}</TableCell>
                  <TableCell>{new Date(i.date_inscription).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell align="center">
                    <IconButton color="success" onClick={() => updateStatut(i.idinscription, "confirmé")}>
                      <Check />
                    </IconButton>
                    <IconButton color="error" onClick={() => updateStatut(i.idinscription, "refusé")}>
                      <Close />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
