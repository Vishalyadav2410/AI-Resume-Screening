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
    const files = e.target.files;

    const formData = new FormData();

    // 🔥 Loop through all selected files
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // IMPORTANT: "files"
    }

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

      alert("Uploaded Successfully ✅");

    } catch (error) {
      console.error(error);
      alert("Upload failed ❌");
    }
  };

  return (
    <Card elevation={6} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Resumes
        </Typography>

        <Box textAlign="center">
          <Button
            variant="contained"
            component="label"
            size="large"
          >
            Upload Multiple Resumes
            {/* 🔥 MULTIPLE ENABLED */}
            <input
              type="file"
              hidden
              multiple
              onChange={handleUpload}
            />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Upload;