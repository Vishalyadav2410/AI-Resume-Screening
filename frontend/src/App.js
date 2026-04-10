import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, Typography, Grid } from "@mui/material";

import Upload from "./components/Upload";
import Results from "./components/Results";
import Login from "./components/Login";
import Register from "./components/Register";

// 🔐 Check token
const isAuthenticated = () => {
  return localStorage.getItem("token");
};

// 🔒 Protected Route
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// 🎯 Main Dashboard Layout
const Dashboard = () => {
  return (
    <div style={{ background: "#eef2f7", minHeight: "100vh", padding: "20px" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight="bold"
        >
          AI Resume Screening Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Upload />
          </Grid>
          <Grid item xs={12} md={8}>
            <Results />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;