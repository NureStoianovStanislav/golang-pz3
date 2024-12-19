import React, { useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import axios from "axios";

const DataAnalysisTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/analysis/${endpoint}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Не вдалося виконати запит.");
      setData([]);
    }
  };

  const renderTable = () => {
    if (!data?.length) return null;

    const columnLabels = {
        full_name: "ПІБ клієнта",
        total_spent: "Сума витрат",
        client_count: "Кількість клієнтів",
        count: "Кількість",
        name: "Назва абонемента",
      };

    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <TableContainer component={Paper} sx={{ width: "auto" }}>
        <Table>
            <TableHead>
            <TableRow>
                {Object.keys(data[0]).map((key) => (
                    <TableCell key={key}>{columnLabels[key] || key}</TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {data.map((row, idx) => (
                <TableRow key={idx}>
                {Object.values(row).map((value, idx2) => (
                    <TableCell key={idx2}>{value}</TableCell>
                ))}
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Аналіз даних
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button sx={{ m: 1, width: "auto" }} onClick={() => fetchData("popular-subscriptions")} variant="contained" color="primary">
            Найпопулярніші абонементи
        </Button>
        <Button sx={{ m: 1, width: "auto" }} onClick={() => fetchData("top-spending-clients")} variant="contained" color="primary">
            Клієнти, що витратили найбільше грошей
        </Button>
        <Button sx={{ m: 1, width: "auto" }} onClick={() => fetchData("top-training-clients")} variant="contained" color="primary">
            Клієнти, що відвідали найбільше тренувань
        </Button>
        <Button sx={{ m: 1, width: "auto" }} onClick={() => fetchData("top-instructors")} variant="contained" color="primary">
            Інструктори, у яких найбільше клієнтів
        </Button>
      </Box>
      {renderTable()}
    </Paper>
  );
};

export default DataAnalysisTable;
