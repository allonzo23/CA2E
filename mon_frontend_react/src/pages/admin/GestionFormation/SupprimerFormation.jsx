import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import api from "../../../api/api";

export default function SupprimerFormation({
  idformation,
  nomFormation,
  onDeleted,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/formations/${idformation}`);

      // ✅ D'abord fermer la boîte de dialogue
      setOpen(false);

      // ✅ Puis attendre un court délai avant de rafraîchir la liste
      setTimeout(() => {
        if (onDeleted) onDeleted(nomFormation);
      }, 200);
    } catch (err) {
      console.error("❌ Erreur suppression formation:", err);

      if (err.response?.data?.error?.code === "23503") {
        alert(
          `⚠️ Impossible de supprimer la formation "${nomFormation}" car elle est liée à des séances existantes.`
        );
      } else {
        alert("❌ Une erreur est survenue lors de la suppression.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton icône uniquement */}
      <Tooltip title="Supprimer">
        <IconButton color="error" onClick={handleOpen}>
          <Delete />
        </IconButton>
      </Tooltip>

      {/* Fenêtre de confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la formation{" "}
            <b>{nomFormation}</b> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={loading}
            variant="contained"
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
