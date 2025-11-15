// src/pages/admin/ApprenantAdmin.jsx
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Modal, TextField, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../../../api/api";

export default function ApprenantAdmin() {
  const [apprenants, setApprenants] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", motdepasse: "", filiere: "", niveau: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchApprenants = async () => {
    try {
      const res = await api.get("/users/role/1"); // 1 = Apprenant
      setApprenants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchApprenants(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet apprenant ?")) {
      await api.delete(`/users/${id}`);
      fetchApprenants();
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.idutilisateur);
      setForm({ nom: user.nom, email: user.email, motdepasse: "", filiere: user.filiere, niveau: user.niveau });
    } else {
      setEditingId(null);
      setForm({ nom: "", email: "", motdepasse: "", filiere: "", niveau: "" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleSubmit = async () => {
    try {
      const payload = { ...form, role: 1 }; // role 1 = Apprenant
      if (editingId) await api.put(`/users/${editingId}`, payload);
      else await api.post("/users", payload);
      handleCloseModal();
      fetchApprenants();
    } catch (err) { console.error(err); }
  };

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={() => handleOpenModal()}>Ajouter un apprenant</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Filière</TableCell>
            <TableCell>Niveau</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apprenants.map(a => (
            <TableRow key={a.idutilisateur}>
              <TableCell>{a.nom}</TableCell>
              <TableCell>{a.email}</TableCell>
              <TableCell>{a.filiere}</TableCell>
              <TableCell>{a.niveau}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenModal(a)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(a.idutilisateur)}><Delete /></IconButton>
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
          <TextField fullWidth label="Filière" sx={{ mb: 2 }} value={form.filiere} onChange={e => setForm({ ...form, filiere: e.target.value })} />
          <TextField fullWidth label="Niveau" sx={{ mb: 2 }} value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })} />
          <Button variant="contained" onClick={handleSubmit}>{editingId ? "Modifier" : "Ajouter"}</Button>
        </Box>
      </Modal>
    </Box>
  );
}
