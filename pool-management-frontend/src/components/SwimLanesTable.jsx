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

const SwimLanesTable = () => {
  const [swimLanes, setSwimLanes] = useState([]);
  const [pools, setPools] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    pool_id: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedLaneID, setEditedLaneID] = useState(0);

  useEffect(() => {
    fetchSwimLanes();
    fetchPools();
  }, []);

  const fetchSwimLanes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/swimlanes");
      setSwimLanes(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити доріжки.");
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

  const handleOpen = (lane = null) => {
    setForm(
      lane 
        ? { 
            id: lane.id, 
            pool_id: lane.pool_id 
          }
        : {
            id: "", 
            pool_id: "" 
          }
    );
    setIsEditMode(!!lane); 
    setEditedLaneID(lane?.id);
    setOpen(true);
  };

  const handleClose = () => {
    setIsEditMode(false); 
    setEditedLaneID(0);
    setOpen(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        // Update
        await axios.put(`http://localhost:8080/api/swimlanes/${editedLaneID}`, {
          id: parseInt(form.id, 10),
          pool_id: parseInt(form.pool_id, 10),
        });
      } else {
        // Add
        await axios.post("http://localhost:8080/api/swimlanes", {
          id: parseInt(form.id, 10),
          pool_id: parseInt(form.pool_id, 10),
        });
      }
      fetchSwimLanes();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Не вдалося зберегти доріжку.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/swimlanes/${id}`);
      fetchSwimLanes();
    } catch (err) {
      console.error(err);
      setError("Не вдалося видалити доріжку.");
    }
  };

  return (
    <TableContainer component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Доріжки
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Додати доріжку
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Номер доріжки</TableCell>
            <TableCell>Номер басейна</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {swimLanes.map((lane) => (
            <TableRow key={lane.id}>
              <TableCell>{lane.id}</TableCell>
              <TableCell>{lane.pool_id}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(lane)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(lane.id)}
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
        <DialogTitle>{isEditMode ? "Редагувати" : "Додати"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Номер доріжки"
            name="id"
            type="number"
            value={form.id}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            label="Басейн"
            name="pool_id"
            select
            value={form.pool_id}
            onChange={handleChange}
            fullWidth
          >
            {pools.map((pool) => (
              <MenuItem key={pool.id} value={pool.id}>
                Басейн {pool.id}
              </MenuItem>
            ))}
          </TextField>
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

export default SwimLanesTable;
