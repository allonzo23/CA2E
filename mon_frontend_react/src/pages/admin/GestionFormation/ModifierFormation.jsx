import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Stack,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import api from "../../../api/api";
  
  export default function ModifierFormation({ open, onClose, formation, onUpdated }) {
    const [formData, setFormData] = useState({
      titre: "",
      description: "",
      duree: "",
      datedebut: "",
      datefin: "",
      etat: "",
    });
  
    useEffect(() => {
      if (formation) {
        setFormData({
          titre: formation.titre || "",
          description: formation.description || "",
          duree: formation.duree || "",
          datedebut: formation.datedebut ? formation.datedebut.split("T")[0] : "",
          datefin: formation.datefin ? formation.datefin.split("T")[0] : "",
          etat: formation.etat || "",
        });
      }
    }, [formation]);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async () => {
      if (!formation?.idformation) {
        console.error("⚠️ ID formation manquant :", formation);
        return;
      }
  
      try {
        await api.put(`/formations/${formation.idformation}`, formData);
        onUpdated();
        onClose();
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Erreur lors de la mise à jour de la formation");
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier la formation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Titre" name="titre" value={formData.titre} onChange={handleChange} />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} />
            <TextField label="Durée" name="duree" value={formData.duree} onChange={handleChange} />
            <TextField type="date" label="Date de début" name="datedebut" value={formData.datedebut} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField type="date" label="Date de fin" name="datefin" value={formData.datefin} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField select label="État" name="etat" value={formData.etat} onChange={handleChange}>
              <MenuItem value="Disponible">En cours</MenuItem>
              <MenuItem value="Terminée">Terminée</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  