import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Refresh, Edit } from "@mui/icons-material";
import api from "../../../api/api";
import ModifierFormation from "./ModifierFormation";
import SupprimerFormation from "./SupprimerFormation";

export default function TousFormations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // États pour la modification
  const [openEdit, setOpenEdit] = useState(false);
  const [formationEdit, setFormationEdit] = useState(null);

  // 🔁 Récupération des formations
  const fetchTousFormations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/formations/tous");
      setFormations(res.data);
    } catch (err) {
      console.error("❌ Erreur lors du chargement :", err);
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
    fetchTousFormations();
  }, []);

  // ✏️ Ouvrir la modale de modification
  const handleEditClick = (formation) => {
    setFormationEdit(formation);
    setOpenEdit(true);
  };

  // 🧹 Fermeture Snackbar
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  // 🗑️ Callback après suppression réussie
  const handleDeleted = (nomFormation) => {
    setSnackbar({
      open: true,
      message: `✅ Formation "${nomFormation}" supprimée avec succès.`,
      severity: "success",
    });
    fetchTousFormations();
  };

  // ✏️ Callback après mise à jour
  const handleUpdated = () => {
    setSnackbar({
      open: true,
      message: "✅ Formation mise à jour avec succès.",
      severity: "success",
    });
    fetchTousFormations();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Liste des Formations
      </Typography>

      {/* 🔁 Bouton rafraîchir */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Tooltip title="Rafraîchir la liste">
          <IconButton color="primary" onClick={fetchTousFormations}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* 🧾 Tableau des formations */}
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : formations.length === 0 ? (
          <Typography align="center">Aucune formation disponible</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Formation</b></TableCell>
                <TableCell><b>Formateur</b></TableCell>
                <TableCell><b>Début</b></TableCell>
                <TableCell><b>Fin</b></TableCell>
                <TableCell><b>État</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formations.map((f) => (
                <TableRow key={f.idformation}>
                  <TableCell>{f.formation}</TableCell>
                  <TableCell>{f.formateur || "-"}</TableCell>
                  <TableCell>
                    {f.datedebut
                      ? new Date(f.datedebut).toLocaleDateString("fr-FR")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {f.datefin
                      ? new Date(f.datefin).toLocaleDateString("fr-FR")
                      : "-"}
                  </TableCell>
                  <TableCell>{f.etat}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier">
                      <IconButton color="primary" onClick={() => handleEditClick(f)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    {/* 🗑️ Composant suppression avec callback */}
                    <SupprimerFormation
                      idformation={f.idformation}
                      nomFormation={f.formation}
                      onDeleted={handleDeleted}
                      onlyIcon
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* 🧩 Modale de modification */}
      <ModifierFormation
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        formation={formationEdit}
        onUpdated={handleUpdated}
      />

      {/* ✅ Snackbar de notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
