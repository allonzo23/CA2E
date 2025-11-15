import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Modal, TextField, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../../../api/api";

export default function AdminAdmin() {
  const [admins, setAdmins] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", motdepasse: "", poste: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/users/role/3"); // 3 = Admin
      setAdmins(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet admin ?")) {
      await api.delete(`/users/${id}`);
      fetchAdmins();
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.idutilisateur);
      setForm({ nom: user.nom, email: user.email, motdepasse: "", poste: user.poste });
    } else {
      setEditingId(null);
      setForm({ nom: "", email: "", motdepasse: "", poste: "" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleSubmit = async () => {
    const payload = { ...form, role: 3 }; // role 3 = Admin
    if (editingId) await api.put(`/users/${editingId}`, payload);
    else await api.post("/users", payload);
    handleCloseModal();
    fetchAdmins();
  };

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={() => handleOpenModal()}>Ajouter un admin</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Poste</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map(a => (
            <TableRow key={a.idutilisateur}>
              <TableCell>{a.nom}</TableCell>
              <TableCell>{a.email}</TableCell>
              <TableCell>{a.poste}</TableCell>
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
          <TextField fullWidth label="Poste" sx={{ mb: 2 }} value={form.poste} onChange={e => setForm({ ...form, poste: e.target.value })} />
          <Button variant="contained" onClick={handleSubmit}>{editingId ? "Modifier" : "Ajouter"}</Button>
        </Box>
      </Modal>
    </Box>
  );
}
