import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Typography,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MediaManager = () => {
    const navigate = useNavigate();
    const [mediaList, setMediaList] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [mediaType, setMediaType] = useState("image");
    const API_URL = "https://backend-8xbb.onrender.com/api/media/";

    const TOKEN = localStorage.getItem("authToken");
    console.log(TOKEN);

    const fetchMedia = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            });
            setMediaList(response.data.results);
        } catch (error) {
            console.error("Error fetching media:", error);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("media_type", mediaType);
        formData.append("file", file);

        try {
            await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Media uploaded successfully");
            fetchMedia();
            setTitle("");
            setFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}${id}/`, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            });
            alert("Media deleted successfully");
            fetchMedia();
        } catch (error) {
            console.error("Error deleting media:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <Typography variant="h4" gutterBottom>Manage Media</Typography>
            <Button
                style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom:"15px" }}
                fullWidth
                variant="contained"
                onClick={() => navigate('/admin-dashboard')}
            >
                Back to Dashboard
            </Button>
            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <FormControl style={{marginBottom:"15px"}}>
                    <InputLabel >Media Type</InputLabel>
                    <Select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                        <MenuItem value="image">Image</MenuItem>
                        <MenuItem value="video">Video</MenuItem>
                    </Select>
                </FormControl>
                <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} required />
                <Button variant="contained" color="primary" type="submit">Upload</Button>
            </form>

            <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>Uploaded Media</Typography>
            {mediaList.map((media) => (
                <Card key={media.id} style={{ marginBottom: "10px" }}>
                    <CardContent>
                        <Typography variant="h6">{media.title}</Typography>
                        {media.media_type === "image" ? (
                            <img src={media.file} alt={media.title} width="100%" style={{ maxHeight: "200px" }} />
                        ) : (
                            <video width="100%" controls>
                                <source src={`http://127.0.0.1:8000${media.file_url}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        <IconButton color="secondary" onClick={() => handleDelete(media.id)}>
                            <DeleteIcon />
                        </IconButton>
                        {/* <p>{`http://127.0.0.1:8000${media.file_url}`}</p> */}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default MediaManager;