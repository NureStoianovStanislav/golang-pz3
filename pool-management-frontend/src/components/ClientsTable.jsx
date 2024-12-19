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
import { SexValues, PreparationLevelValues } from "../services/enums";

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    first_name: "",
    last_name: "",
    middle_name: "",
    sex: "",
    preparation_level: "",
    date_of_birth: "",
    email: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clients");
      setClients(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch clients");
    }
  };

  const handleOpen = (client = null) => {
    if (client) {
      setForm({
        id: client?.id,
        first_name: client?.first_name,
        last_name: client?.last_name,
        middle_name: client?.middle_name,
        sex: client?.sex,
        preparation_level: client?.preparation_level,
        date_of_birth: formatDateTimeData(client?.date_of_birth),
        email: client?.email
      })
    } else {
      setForm({
        id: null,
        datetime_start: "",
        datetime_end: "",
        swimlane_id: "",
        card_id: "",
        locker_id: "",
        client_id: "",
      })
    };
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
        await axios.put(`http://localhost:8080/api/clients/${form.id}`, form);
      } else {
        // Add
        await axios.post("http://localhost:8080/api/clients", form);
      }
      fetchClients();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save client");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/clients/${id}`);
      fetchClients();
    } catch (err) {
      console.error(err);
      setError("Failed to delete client");
    }
  };

  const formatDateTimeData = (dateString) => {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.slice(0, 10);
  }

  return (
    <TableContainer component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Клієнти
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Додати клієнта
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Прізвище</TableCell>
            <TableCell>Ім'я</TableCell>
            <TableCell>По-батькові</TableCell>
            <TableCell>Стать</TableCell>
            <TableCell>Рівень підготовки</TableCell>
            <TableCell>Електронна адреса</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.id}</TableCell>
              <TableCell>{client.last_name}</TableCell>
              <TableCell>{client.first_name}</TableCell>
              <TableCell>{client.middle_name}</TableCell>
              <TableCell>{client.sex}</TableCell>
              <TableCell>{client.preparation_level}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(client)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(client.id)}
                >
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
            margin="dense"
            label="Прізвище"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            fullWidth
          />
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
            label="По-батькові"
            name="middle_name"
            value={form.middle_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Стать"
            name="sex"
            select
            value={form.sex}
            onChange={handleChange}
            fullWidth
          >
            {SexValues.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Рівень підготовки"
            name="preparation_level"
            select
            value={form.preparation_level}
            onChange={handleChange}
            fullWidth
          >
            {PreparationLevelValues.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Дата народження"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Електронна адреса"
            name="email"
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

export default ClientsTable;
