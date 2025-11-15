import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import api from "../../../api/api";

export default function FormationsConfirmees() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchFormationsConfirmees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inscriptions/confirmees");
      setFormations(res.data);
    } catch (err) {
      console.error("Erreur:", err);
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des formations",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormationsConfirmees();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Formations confirmées
      </Typography>

      {/* 🔁 Bouton rafraîchir */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchFormationsConfirmees}
        >
          Rafraîchir la liste
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : formations.length === 0 ? (
          <Typography align="center">Aucune formation confirmée</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Titre de la formation</b></TableCell>
                <TableCell><b>Total inscrits</b></TableCell>
                <TableCell><b>Apprenants</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formations.map((f) => (
                <TableRow key={f.idformation}>
                  <TableCell>{f.titre}</TableCell>
                  <TableCell>{f.total_inscrits}</TableCell>
                  <TableCell>
                    {f.apprenants && f.apprenants.length > 0 ? (
                      f.apprenants.map((a) => (
                        <Chip
                          key={a.idapprenant}
                          label={a.nom}
                          size="small"
                          sx={{ m: 0.3 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucun apprenant
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        alert(`Gérer les séances pour ${f.titre}`)
                      }
                    >
                      Gérer les séances
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

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
