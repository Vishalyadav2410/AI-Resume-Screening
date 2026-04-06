import Upload from "./components/Upload";
import Results from "./components/Results";
import { Container, Typography, Grid } from "@mui/material";

function App() {
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
}

export default App;