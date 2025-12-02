"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Button, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
}

interface FormData {
  id_usuario?: number;
  nombre: string;
  correo: string;
  password: string;
}

export default function Usuarios() {
  const { data: session } = useSession();
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<FormData>({ nombre: "", correo: "", password: "" });
  const [isEditing, setIsEditing] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${(session as any)?.accessToken || ""}` }
    });
    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  useEffect(() => { if (session) load(); }, [session]);

  const handleOpenModal = (usuario?: Usuario) => {
    if (usuario) {
      setForm({ 
        id_usuario: usuario.id_usuario, 
        nombre: usuario.nombre, 
        correo: usuario.correo, 
        password: "" 
      });
      setIsEditing(true);
    } else {
      setForm({ nombre: "", correo: "", password: "" });
      setIsEditing(false);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setForm({ nombre: "", correo: "", password: "" });
    setIsEditing(false);
  };

  const save = async () => {
    if (!form.nombre || !form.correo || (!isEditing && !form.password)) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    const endpoint = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/usuarios/update/${form.id_usuario}`
      : `${process.env.NEXT_PUBLIC_API_URL}/usuarios/save`;
    
    const method = isEditing ? "PUT" : "POST";
    
    const body: any = { 
      id_rol: 0, 
      nombre: form.nombre, 
      correo: form.correo 
    };
    
    if (form.password) {
      body.password = form.password;
    }

    await fetch(endpoint, {
      method,
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${(session as any)?.accessToken || ""}` 
      },
      body: JSON.stringify(body)
    });
    
    handleCloseModal();
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${(session as any)?.accessToken || ""}` }
    });
    await load();
  };

  return (
    <main className="section-main">
      <div className="title-list" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5>Usuarios</h5>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Usuario
        </Button>
      </div>

      {loading && (
        <div className="text-center" style={{ margin: "20px 0" }}>
          <CircularProgress size={30} />
        </div>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Correo</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              data.map((u) => (
                <TableRow key={u.id_usuario} hover>
                  <TableCell>{u.id_usuario}</TableCell>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.correo}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenModal(u)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        color="error" 
                        onClick={() => remove(u.id_usuario)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Crear/Editar Usuario */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            style={{ marginBottom: 16, marginTop: 8 }}
          />
          <TextField
            margin="dense"
            label="Correo"
            type="email"
            fullWidth
            variant="outlined"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            style={{ marginBottom: 16 }}
          />
          <TextField
            margin="dense"
            label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
            type="password"
            fullWidth
            variant="outlined"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            helperText={isEditing ? "Dejar en blanco para mantener la contraseña actual" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={save} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

