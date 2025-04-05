
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
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
const API_URL = "https://backend-8xbb.onrender.com/api/media/";
const TOKEN = localStorage.getItem("authToken");

const TVAdPlayer = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            setAds(response.data.results);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    useEffect(() => {
        if (ads.length > 0) {
            playNextAd();
        }
    }, [ads]);

    const playNextAd = () => {
        if (ads.length === 0) return;

        const currentAd = ads[currentIndex];

        if (currentAd.media_type === "image") {
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
                playNextAd();
            }, (currentAd.duration || 10) * 1000);
        } else {
            if (videoRef.current) {
                videoRef.current.load(); // Ensure fresh playback
                videoRef.current.play(); // Start playing video
                videoRef.current.onended = () => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
                    playNextAd();
                };
            }
        }
    };

    if (ads.length === 0) {
        return <div style={styles.container}>Loading Ads...</div>;
    }

    const currentAd = ads[currentIndex];

    return (
        <div style={styles.container}>
        <Button
                style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom:"15px" }}
                fullWidth
                variant="contained"
                onClick={() => navigate('/admin-dashboard')}
            >
                Back to Dashboard
            </Button>
            {currentAd.media_type === "image" ? (
                <img src={currentAd.file} alt={currentAd.title} style={styles.media} />
            ) : (
                <video ref={videoRef} autoPlay style={styles.media} controls>
                    <source src={currentAd.file} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

const styles = {
    container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
    },
    media: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
    },
};

export default TVAdPlayer;

