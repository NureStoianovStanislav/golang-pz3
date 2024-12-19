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

const PoolsTable = () => {
  const [pools, setPools] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    capacity: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPoolID, setEditedPoolID] = useState(0);

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/pools");
      setPools(response.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити басейни.");
    }
  };

  const handleOpen = (pool = null) => {
    setForm(
      pool
        ? {
            id: pool.id,
            capacity: pool.capacity,
          }
        : {
            id: "",        
            capacity: "",
          }
    );
    setIsEditMode(!!pool); 
    setEditedPoolID(pool?.id);
    setOpen(true);
  };

  const handleClose = () => {
    setIsEditMode(false);
    setEditedPoolID(0);
    setOpen(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // Update 
        await axios.put(`http://localhost:8080/api/pools/${editedPoolID}`, {
          id: parseInt(form.id, 10),
          capacity: parseInt(form.capacity, 10),
        });
      } else {
        // Add
        await axios.post("http://localhost:8080/api/pools", {
          id: parseInt(form.id, 10),
          capacity: parseInt(form.capacity, 10),
        });
      }
      fetchPools();
      handleClose();
    } catch (err) {
      console.error("Error during pool save:", err.response ? err.response.data : err.message);
      setError("Не вдалося зберегти басейн.");
    }
  };  
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/pools/${id}`);
      fetchPools();
    } catch (err) {
      console.error(err);
      setError("Не вдалося видалити басейн.");
    }
  };

  return (
    <TableContainer component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Басейни
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Додати басейн
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Номер басейна</TableCell>
            <TableCell>Місткість</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pools.map((pool) => (
            <TableRow key={pool.id}>
              <TableCell>{pool.id}</TableCell>
              <TableCell>{pool.capacity}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(pool)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(pool.id)}
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
            label="Номер басейну"
            name="id"
            type="number"
            value={form.id}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Місткість"
            name="capacity"
            type="number"
            value={form.capacity}
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

export default PoolsTable;
