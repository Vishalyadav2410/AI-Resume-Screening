import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  Avatar,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Dashboard from "./Dashboard";

// 🔗 API CONFIG
const API = "http://127.0.0.1:8000";
// const API = "https://resume-ai-backend-u4mo.onrender.com";

function Results() {
  const [job, setJob] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 CHECK LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 🧠 RANK FUNCTION
  const handleRank = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("⚠️ Please login first!");
        navigate("/login");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        `${API}/rank/`,
        { job_description: job },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data.ranking);

    } catch (err) {
      console.error("Error:", err);

      if (err.response?.status === 401) {
        alert("❌ Session expired. Login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("⚠️ Backend error!");
      }

    } finally {
      setLoading(false);
    }
  };

  // 📄 DOWNLOAD REPORT
  const handleDownload = async () => {
    try {
      await axios.get(`${API}/download/`);
      alert("✅ Report generated!");
    } catch {
      alert("❌ Error generating report");
    }
  };

  // 🔓 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Card elevation={6} sx={{ borderRadius: 3 }}>
      <CardContent>

        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Job Description</Typography>

          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter job description..."
          sx={{ mt: 2 }}
          onChange={(e) => setJob(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRank}
          disabled={loading}
        >
          {loading ? "Ranking..." : "Rank Candidates"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleDownload}
        >
          Download Report
        </Button>

        {/* 🏆 TOP CANDIDATE */}
        {result.length > 0 && (
          <Box
            mt={4}
            p={2}
            sx={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              borderRadius: 3,
              color: "black",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "black" }}>
                <EmojiEventsIcon />
              </Avatar>

              <div>
                <Typography variant="h6">
                  Top Candidate #{result[0][0]}
                </Typography>

                <Typography variant="body2">
                  Score: {result[0][1]?.toFixed(3)}
                </Typography>

                <Typography variant="body2" mt={1}>
                  {result[0][2] || "No explanation"}
                </Typography>

                <Box mt={1}>
                  {(result[0][3] || []).map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      size="small"
                      sx={{ mr: 1, mt: 0.5 }}
                    />
                  ))}
                </Box>

                {/* 🧾 PREVIEW */}
                <Typography variant="body2" mt={1}>
                  Preview: {result[0][4] || "No preview"}
                </Typography>
              </div>
            </Box>
          </Box>
        )}

        {/* 📊 DASHBOARD */}
        {result.length > 0 && (
          <Box mt={4}>
            <Typography variant="subtitle1">Analytics</Typography>
            <Dashboard data={result} />
          </Box>
        )}

        {/* 📋 ALL CANDIDATES */}
        <Box mt={3}>
          <Typography variant="subtitle1">All Candidates</Typography>

          {result.map((r, i) => (
            <Box
              key={i}
              mt={2}
              p={2}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography>Candidate {r[0]}</Typography>

                <Typography fontWeight="bold">
                  {r[1]?.toFixed(3)}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(r[1] || 0) * 100}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 5,
                }}
              />

              <Typography variant="body2" mt={1}>
                {r[2] || "No explanation"}
              </Typography>

              <Box mt={1}>
                {(r[3] || []).map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    size="small"
                    sx={{ mr: 1, mt: 0.5 }}
                  />
                ))}
              </Box>

              {/* 🧾 PREVIEW */}
              <Typography variant="body2" mt={1}>
                Preview: {r[4] || "No preview available"}
              </Typography>
            </Box>
          ))}
        </Box>

      </CardContent>
    </Card>
  );
}

export default Results;