import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Devices as DevicesIcon,
  Image as ImageIcon,
  PlaylistPlay as PlaylistIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    devices: 0,
    media: 0,
    playlists: 0,
    schedules: 0
  });

  const api = useCallback(() => axios.create({
    baseURL: 'https://backend-8xbb.onrender.com/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  }), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mediaRes, playlistsRes, devicesRes, schedulesRes] = await Promise.all([
        api().get('/media/'),
        api().get('/playlists/'),
        api().get('/devices/'),
        api().get('/schedules/')
      ]);

      setStats({
        media: mediaRes.data.count || mediaRes.data.length || 0,
        playlists: playlistsRes.data.count || playlistsRes.data.length || 0,
        devices: devicesRes.data.count || devicesRes.data.length || 0,
        schedules: schedulesRes.data.count || schedulesRes.data.length || 0
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const StatCard = ({ icon, title, value }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h5" ml={2}>{value}</Typography>
        </Box>
        <Typography color="textSecondary">{title}</Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          onClick={fetchData}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<DevicesIcon color="primary" fontSize="large" />} title="Devices" value={stats.devices} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<ImageIcon color="secondary" fontSize="large" />} title="Media Items" value={stats.media} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PlaylistIcon color="success" fontSize="large" />} title="Playlists" value={stats.playlists} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<ScheduleIcon color="warning" fontSize="large" />} title="Schedules" value={stats.schedules} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" startIcon={<DevicesIcon />} onClick={() => navigate('/admin/device-manager')}>
                    Manage Devices
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" startIcon={<ImageIcon />} onClick={() => navigate('/admin/media')}>
                    Manage Media
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" startIcon={<PlaylistIcon />} onClick={() => navigate('/admin/playlist-manager')}>
                    Manage Playlists
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" startIcon={<ScheduleIcon />} onClick={() => navigate('/tv-display')}>
                    Watch Advertisement
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
