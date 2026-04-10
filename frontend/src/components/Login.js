import { useState } from "react";
import axios from "axios";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");   // ✅ changed
  const [password, setPassword] = useState("");
  const navigate = useNavigate();                 // ✅ required

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", {
        username: username,
        password: password,
      });

      localStorage.setItem("token", res.data.access_token);

      alert("Login Successful ✅");
      navigate("/");

    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 10, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Login
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
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* 🔗 GO TO REGISTER */}
        <Typography mt={2}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>

      </CardContent>
    </Card>
  );
}

export default Login;