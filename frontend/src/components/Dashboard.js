import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  
  import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
  
  function Dashboard({ data }) {
    // 📊 Score Data
    const scoreData = data.map((r) => ({
      name: `C${r[0]}`,
      score: Number(r[1]?.toFixed(3)),
    }));
  
    // 🔍 Skill Count Data
    const skillData = data.map((r) => ({
      name: `C${r[0]}`,
      skills: r[3]?.length || 0,
    }));
  
    return (
      <Box mt={2}>
        <Grid container spacing={2}>
          
          {/* 📊 SCORE CHART */}
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Candidate Score Analysis
                </Typography>
  
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
  
          {/* 🔍 SKILL ANALYSIS */}
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skill Distribution
                </Typography>
  
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="skills" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
  
        </Grid>
  
        {/* 🧠 AI INSIGHTS */}
        <Box mt={3}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">AI Insights</Typography>
  
              <Typography variant="body2" mt={1}>
                • Candidates with higher skill count tend to score better.
              </Typography>
  
              <Typography variant="body2">
                • Top candidate shows strong semantic similarity with job description.
              </Typography>
  
              <Typography variant="body2">
                • Skill matching + experience weighting improves ranking accuracy.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }
  
  export default Dashboard;