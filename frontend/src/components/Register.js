import axios from "axios";
import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const API = "http://127.0.0.1:8000";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/register/`, {
        username: username,
        password: password,
      });

      alert("Registered Successfully ✅");

      // 👉 Redirect to login after register
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 10, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          Register
        </Button>

        {/* 🔗 Back to Login */}
        <Typography mt={2}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>

      </CardContent>
    </Card>
  );
}

export default Register;