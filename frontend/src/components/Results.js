import axios from "axios";
import { useState } from "react";
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

function Results() {
  const [job, setJob] = useState("");
  const [result, setResult] = useState([]);

  const handleRank = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/rank/", {
        job_description: job,
      });
      setResult(res.data.ranking);
    } catch (err) {
      console.error("Error:", err);
      alert("Backend error! Check server.");
    }
  };

  return (
    <Card elevation={6} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Job Description
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter job description..."
          onChange={(e) => setJob(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRank}
        >
          Rank Candidates
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => axios.get("http://127.0.0.1:8000/download/")}
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

              {/* 📊 PROGRESS BAR */}
              <LinearProgress
                variant="determinate"
                value={(r[1] || 0) * 100}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 5,
                }}
              />

              {/* 🤖 AI Explanation */}
              <Typography variant="body2" mt={1}>
                {r[2] || "No explanation"}
              </Typography>

              {/* 🔍 Skills */}
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

              {/* 🧾 Resume Preview */}
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