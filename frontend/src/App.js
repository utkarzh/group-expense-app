import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ExpenseGroup from "./components/ExpenseGroup";
import CreateGroup from "./components/CreateGroup";
import ViewAnalysis from "./components/ViewAnalysis";
function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups/:id" element={<ExpenseGroup />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="expense/:id/viewAnalysis" element={<ViewAnalysis />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
