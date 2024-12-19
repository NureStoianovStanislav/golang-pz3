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

const VisitorCardsTable = () => {
  const [visitorCards, setVisitorCards] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    subscription_id: "",
    client_id: "",
    start_date: "",
    expiry_date: "",
    attendance_left_count: "",
  });

  useEffect(() => {
    fetchVisitorCards();
    fetchClients();
    fetchSubscriptions();
  }, []);

  const fetchVisitorCards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/visitor_cards");
      setVisitorCards(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити картки відвідувачів.");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clients");
      setClients(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити клієнтів.");
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/subscriptions");
      setSubscriptions(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити абонементи.");
    }
  };

  const handleOpen = (visitorCard = null) => {
    if (visitorCard) {
      setForm({
        id: visitorCard.id,
        subscription_id: visitorCard.subscription_id || "",
        client_id: visitorCard.client_id || "",
        start_date: visitorCard.start_date.slice(0, 10),
        expiry_date: visitorCard.expiry_date.slice(0, 10),
        attendance_left_count: visitorCard.attendance_left_count || "",
      });
    } else {
      setForm({
        id: null,
        subscription_id: "",
        client_id: "",
        start_date: "",
        expiry_date: "",
        attendance_left_count: "",
      });
    }
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
        await axios.put(`http://localhost:8080/api/visitor_cards/${form.id}`, {
            id: form.id,
            subscription_id: form.subscription_id,
            client_id: form.client_id,
            start_date: form.start_date,
            expiry_date: form.expiry_date,
            attendance_left_count: parseInt(form.attendance_left_count),
        });
      } else {
        // Add 
        await axios.post("http://localhost:8080/api/visitor_cards", {
            id: form.id,
            subscription_id: form.subscription_id,
            client_id: form.client_id,
            start_date: form.start_date,
            expiry_date: form.expiry_date,
            attendance_left_count: parseInt(form.attendance_left_count),
        });
      }
      fetchVisitorCards();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Не вдалося зберегти картку відвідувача.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/visitor_cards/${id}`);
      fetchVisitorCards();
    } catch (err) {
      console.error(err);
      setError("Не вдалося видалити картку відвідувача.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
  }

  const formatClient = (client_id) => {
    const client = clients.find(client => client.id === client_id);
    return `${client?.last_name || ''} ${client?.first_name || ''} ${client?.middle_name || ''}`;
  }  

  const formatSubscription = (subscription_id) => {
    const subscription = subscriptions.find(subscription => subscription.id === subscription_id);
    return subscription?.name || '';
  }  

  return (
    <TableContainer component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Картки відвідувачів
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Додати картку
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>ПІБ клієнта</TableCell>
            <TableCell>Абонемент</TableCell>
            <TableCell>Дата початку дії</TableCell>
            <TableCell>Дата закінчення дії</TableCell>
            <TableCell style={{ width: '10%' }}>Залишилось відвідувань</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visitorCards.map((vc) => (
            <TableRow key={vc.id}>
              <TableCell>{vc.id}</TableCell>
              <TableCell>{formatClient(vc.client_id)}</TableCell>
              <TableCell>{formatSubscription(vc.subscription_id)}</TableCell>
              <TableCell>{formatDate(vc.start_date)}</TableCell>
              <TableCell>{formatDate(vc.expiry_date)}</TableCell>
              <TableCell style={{ width: '10%' }} align="center">{vc.attendance_left_count}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(vc)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(vc.id)}
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
            label="Абонемент"
            name="subscription_id"
            select
            value={form.subscription_id}
            onChange={handleChange}
            fullWidth
          >
            {subscriptions.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Клієнт"
            name="client_id"
            select
            value={form.client_id}
            onChange={handleChange}
            fullWidth
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {formatClient(client.id)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Дата початку"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Дата закінчення"
            name="expiry_date"
            type="date"
            format="DD - MM - YYYY"
            value={form.expiry_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Залишок відвідувань"
            name="attendance_left_count"
            type="number"
            value={form.attendance_left_count}
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

export default VisitorCardsTable;
