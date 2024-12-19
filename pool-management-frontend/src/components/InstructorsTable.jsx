import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";

const InstructorsTable = () => {
  const [instructors, setInstructors] = useState([]);
  const [pools, setPools] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    first_name: "",
    last_name: "",
    middle_name: "",
    salary: "",
    pool_id: null,
    email: "",
  });

  useEffect(() => {
    fetchInstructors();
    fetchPools();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/instructors");
      setInstructors(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити інструкторів.");
    }
  };

  const fetchPools = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/pools");
      setPools(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити басейни.");
    }
  };

  const handleOpen = (instructor = null) => {
    setForm(
      instructor || {
        id: null,
        first_name: "",
        last_name: "",
        middle_name: "",
        salary: "",
        pool_id: null,
        email: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        // Update
        await axios.put(`http://localhost:8080/api/instructors/${form.id}`, {
            id: form.id,
            first_name: form.first_name,
            last_name: form.last_name,
            middle_name: form.middle_name,
            salary: parseFloat(form.salary),
            pool_id: parseInt(form.pool_id),
            email: form.email,
          });
      } else {
        // Add
        await axios.post("http://localhost:8080/api/instructors", {
            id: form.id,
            first_name: form.first_name,
            last_name: form.last_name,
            middle_name: form.middle_name,
            salary: parseFloat(form.salary),
            pool_id: parseInt(form.pool_id),
            email: form.email,
          });
      }
      fetchInstructors();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Не вдалося зберегти інструктора.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/instructors/${id}`);
      fetchInstructors();
    } catch (err) {
      console.error(err);
      setError("Не вдалося видалити інструктора.");
    }
  };

  return (
    <TableContainer component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        Інструктори
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Додати інструктора
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ім'я</TableCell>
            <TableCell>Прізвище</TableCell>
            <TableCell>По-батькові</TableCell>
            <TableCell>Зарплата</TableCell>
            <TableCell style={{ width: '10%' }}>Номер басейна</TableCell>
            <TableCell>Електронна адреса</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructors.map((inst) => (
            <TableRow key={inst.id}>
              <TableCell>{inst.id}</TableCell>
              <TableCell>{inst.first_name}</TableCell>
              <TableCell>{inst.last_name}</TableCell>
              <TableCell>{inst.middle_name}</TableCell>
              <TableCell>{inst.salary}₴</TableCell>
              <TableCell style={{ width: '10%' }}>{inst.pool_id || "Без басейну"}</TableCell>
              <TableCell>{inst.email}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" onClick={() => handleOpen(inst)}>
                  Редагувати
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(inst.id)}>
                  Видалити
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.id ? "Редагувати" : "Додати"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ім'я"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Прізвище"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="По-батькові"
            name="middle_name"
            value={form.middle_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Зарплата"
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Басейн"
            name="pool_id"
            select
            value={form.pool_id || ""}
            onChange={handleChange}
            fullWidth
          >
            {pools.map((pool) => (
              <MenuItem key={pool.id} value={pool.id}>
                Басейн {pool.id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Відмінити
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default InstructorsTable;
