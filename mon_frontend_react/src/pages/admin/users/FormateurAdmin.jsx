import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Modal, TextField, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../../../api/api";

export default function FormateurAdmin() {
  const [formateurs, setFormateurs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", motdepasse: "", specialite: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchFormateurs = async () => {
    try {
      const res = await api.get("/users/role/2"); // 2 = Formateur
      setFormateurs(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFormateurs(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce formateur ?")) {
      await api.delete(`/users/${id}`);
      fetchFormateurs();
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.idutilisateur);
      setForm({ nom: user.nom, email: user.email, motdepasse: "", specialite: user.specialite });
    } else {
      setEditingId(null);
      setForm({ nom: "", email: "", motdepasse: "", specialite: "" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleSubmit = async () => {
    const payload = { ...form, role: 2 }; // role 2 = Formateur
    if (editingId) await api.put(`/users/${editingId}`, payload);
    else await api.post("/users", payload);
    handleCloseModal();
    fetchFormateurs();
  };

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={() => handleOpenModal()}>Ajouter un formateur</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Spécialité</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formateurs.map(f => (
            <TableRow key={f.idutilisateur}>
              <TableCell>{f.nom}</TableCell>
              <TableCell>{f.email}</TableCell>
              <TableCell>{f.specialite}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenModal(f)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(f.idutilisateur)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, bgcolor: "white", mx: "auto", mt: "10%", width: 400, borderRadius: 2 }}>
          <TextField fullWidth label="Nom" sx={{ mb: 2 }} value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
          <TextField fullWidth label="Email" sx={{ mb: 2 }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Mot de passe" type="password" sx={{ mb: 2 }} value={form.motdepasse} onChange={e => setForm({ ...form, motdepasse: e.target.value })} />
          <TextField fullWidth label="Spécialité" sx={{ mb: 2 }} value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })} />
          <Button variant="contained" onClick={handleSubmit}>{editingId ? "Modifier" : "Ajouter"}</Button>
        </Box>
      </Modal>
    </Box>
  );
}

