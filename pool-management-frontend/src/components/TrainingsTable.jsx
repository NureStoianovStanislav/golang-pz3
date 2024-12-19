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

const TrainingsTable = () => {
  const [trainings, setTrainings] = useState([]);
  const [visitorCards, setVisitorCards] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [clients, setClients] = useState([]);
  const [swimLanes, setSwimLanes] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    datetime_start: "",
    datetime_end: "",
    swimlane_id: "",
    card_id: "",
    locker_id: "",
  });

  useEffect(() => {
    fetchTrainings();
    fetchVisitorCards();
    fetchSubscriptions();
    fetchClients();
    fetchSwimLanes();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/trainings");
      setTrainings(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити тренування.");
    }
  };

  const fetchVisitorCards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/visitor_cards");
      setVisitorCards(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити картки відвідувачів.");
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/subscriptions");
      setSubscriptions(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch subscriptions");
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

  const fetchSwimLanes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/swimlanes");
      setSwimLanes(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити доріжки.");
    }
  };

  const handleOpen = (training = null) => {
    if (training) {
      const visitorCard = visitorCards.find((vc) => vc.id === training.card_id);
      const clientId = visitorCard?.client_id || "";
  
      setForm({
        id: training.id,
        datetime_start: formatDateTimeData(training.datetime_start),
        datetime_end: formatDateTimeData(training.datetime_end),
        swimlane_id: training.swimlane_id || "",
        card_id: training.card_id || "",
        locker_id: training.locker_id || "",
        client_id: clientId,
      });
    } else {
      setForm({
        id: null,
        datetime_start: "",
        datetime_end: "",
        swimlane_id: "",
        card_id: "",
        locker_id: "",
        client_id: "",
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
        await axios.put(`http://localhost:8080/api/trainings/${form.id}`, {
            id: form.id,
            datetime_start: form.datetime_start,
            datetime_end: form.datetime_end,
            swimlane_id: parseInt(form.swimlane_id),
            card_id: parseInt(form.card_id),
            locker_id: parseInt(form.locker_id),
          });
      } else {
        // Add
        await axios.post("http://localhost:8080/api/trainings", {
            id: form.id,
            datetime_start: form.datetime_start,
            datetime_end: form.datetime_end,
            swimlane_id: parseInt(form.swimlane_id),
            card_id: parseInt(form.card_id),
            locker_id: parseInt(form.locker_id),
          });
      }
      fetchTrainings();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Не вдалося зберегти тренування.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/trainings/${id}`);
      fetchTrainings();
    } catch (err) {
      console.error(err);
      setError("Не вдалося видалити тренування.");
    }
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA');
  }

  const formatDateTimeData = (dateString) => {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.slice(0, 16);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
  }

  const formatClientFromCard = (visitor_card_id) => {
    const visitor_card = visitorCards.find(visitor_card => visitor_card.id === visitor_card_id);
    const client = clients.find(client => client.id === visitor_card?.client_id);
    return formatClient(client?.id);
  }  

  const formatClient = (client_id) => {
    const client = clients.find(client => client.id === client_id);
    return `${client?.last_name || ''} ${client?.first_name || ''} ${client?.middle_name || ''}`;
  }  

  const formatVisitorCard = (visitor_card_id) => {
    const visitor_card = visitorCards.find(visitor_card => visitor_card.id === visitor_card_id);
    const subscription = subscriptions.find(subscription => subscription.id === visitor_card.subscription_id);
    return `${subscription?.name || ''}, ${formatDate(visitor_card?.start_date) || ''} - ${formatDate(visitor_card?.expiry_date) || ''}`;
  }  

  const formatPool = (swimlane_id) => {
    const swimlane = swimLanes.find(swimlane => swimlane.id === swimlane_id);
    return swimlane?.pool_id || "";
  } 

  return (
    <TableContainer component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Тренування
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Додати тренування
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>ПІБ клієнта</TableCell>
            <TableCell style={{ width: '10%' }}>Номер басейна</TableCell>
            <TableCell style={{ width: '10%' }}>Номер доріжки</TableCell>
            <TableCell>Час початку</TableCell>
            <TableCell>Час закінчення</TableCell>
            <TableCell>Номер шафи</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trainings.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.id}</TableCell>
              <TableCell>{formatClientFromCard(t.card_id)}</TableCell>
              <TableCell style={{ width: '10%' }}>{formatPool(t.swimlane_id)}</TableCell>
              <TableCell style={{ width: '10%' }}>{t.swimlane_id}</TableCell>
              <TableCell>
                {formatDateTime(t.datetime_start)}
              </TableCell>
              <TableCell>
                {formatDateTime(t.datetime_end)}
              </TableCell>
              <TableCell>{t.locker_id}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(t)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(t.id)}
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
            label="Картка відвідувача"
            name="card_id"
            select
            value={form.card_id}
            onChange={handleChange}
            fullWidth
          >
            {visitorCards
              .filter(visitor_card => visitor_card.client_id === form.client_id)
              .map((card) => (
                <MenuItem key={card.id} value={card.id}>
                  {formatVisitorCard(card.id)}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            margin="dense"
            label="Номер доріжки"
            name="swimlane_id"
            select
            value={form.swimlane_id}
            onChange={handleChange}
            fullWidth
          >
            {swimLanes.map((lane) => (
              <MenuItem key={lane.id} value={lane.id}>
                {lane.id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Час початку"
            name="datetime_start"
            type="datetime-local"
            value={form.datetime_start}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Час закінчення"
            name="datetime_end"
            type="datetime-local"
            value={form.datetime_end}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Номер шафи"
            name="locker_id"
            type="number"
            value={form.locker_id}
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

export default TrainingsTable;
