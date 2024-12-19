import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/clients">
          Клієнти
        </Button>
        <Button color="inherit" component={Link} to="/subscriptions">
          Абонементи
        </Button>
        <Button color="inherit" component={Link} to="/visitor-cards">
          Картки відвідувачів
        </Button>
        <Button color="inherit" component={Link} to="/trainings">
          Тренування
        </Button>
        <Button color="inherit" component={Link} to="instructors">
          Інструктори
        </Button>
        <Button color="inherit" component={Link} to="/swim-lanes">
          Доріжки
        </Button>
        <Button color="inherit" component={Link} to="pools">
          Басейни
        </Button>
        <Button color="inherit" component={Link} to="data-analysis">
          Аналіз даних
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
