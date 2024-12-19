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
  Typography,
} from "@mui/material";
import axios from "axios";

const SubscriptionsTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    attendance_count: "",
    day_count: "",
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/subscriptions");
      setSubscriptions(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch subscriptions");
    }
  };

  const handleOpen = (subscription = null) => {
    setForm(
      subscription || {
        id: null,
        name: "",
        price: "",
        attendance_count: "",
        day_count: "",
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
        await axios.put("http://localhost:8080/api/subscriptions/${form.id}", {
          id: form.id,
          name: form.name,
          price: parseFloat(form.price),
          attendance_count: parseInt(form.attendance_count, 10),
          day_count: parseInt(form.day_count, 10),
        });
      } else {
        // Add
        await axios.post("http://localhost:8080/api/subscriptions", {
          id: form.id,
          name: form.name,
          price: parseFloat(form.price),
          attendance_count: parseInt(form.attendance_count, 10), 
          day_count: parseInt(form.day_count, 10),
        });
      }
      fetchSubscriptions();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save subscription");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/subscriptions/${id}`);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      setError("Failed to delete subscription");
    }
  };

  return (
    <TableContainer component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Абонементи
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Додати абонемент
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Назва</TableCell>
            <TableCell>Ціна</TableCell>
            <TableCell style={{ width: '10%' }}>Кількість відвідувань</TableCell>
            <TableCell>Строк дії</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell>{sub.id}</TableCell>
              <TableCell>{sub.name}</TableCell>
              <TableCell>{sub.price}₴</TableCell>
              <TableCell style={{ width: '10%' }}>{sub.attendance_count}</TableCell>
              <TableCell>{sub.day_count} днів</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(sub)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(sub.id)}
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
        <DialogTitle>{form.id ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Назва"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Ціна"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Кількість відвідувань"
            name="attendance_count"
            type="number"
            value={form.attendance_count}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Строк дії (днів)"
            name="day_count"
            type="number"
            value={form.day_count}
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

export default SubscriptionsTable;
