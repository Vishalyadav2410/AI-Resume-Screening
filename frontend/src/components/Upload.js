import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";

function Upload() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/upload_resume/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    }
  };

  return (
    <Card elevation={6} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Resume
        </Typography>

        <Box textAlign="center">
          <Button
            variant="contained"
            component="label"
            size="large"
          >
            Upload Resume
            <input type="file" hidden onChange={handleUpload} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Upload;