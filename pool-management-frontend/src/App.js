import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Header from "./components/Header";
import SubscriptionsTable from "./components/SubscriptionsTable";
import ClientsTable from "./components/ClientsTable";
import VisitorCardsTable from "./components/VisitorCardsTable";
import TrainingsTable from "./components/TrainingsTable";
import InstructorsTable from "./components/InstructorsTable";
import PoolsTable from "./components/PoolsTable";
import SwimLanesTable from "./components/SwimLanesTable";
import DataAnalysisTable from "./components/DataAnalysisTable";

function App() {
  return (
    <Router>
      <Header />
      <Container>
        <Routes>
          <Route path="/clients" element={<ClientsTable />} />
          <Route path="/subscriptions" element={<SubscriptionsTable />} />
          <Route path="/visitor-cards" element={<VisitorCardsTable />} />
          <Route path="/trainings" element={<TrainingsTable />} />
          <Route path="/swim-lanes" element={<SwimLanesTable />} />
          <Route path="/pools" element={<PoolsTable />} />
          <Route path="/instructors" element={<InstructorsTable />} />
          <Route path="/data-analysis" element={<DataAnalysisTable />} />
          <Route path="*" element={<ClientsTable />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
