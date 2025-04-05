import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './DeviceManager.css';
import { useNavigate } from 'react-router-dom';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    location: '',
    version: ''
  });
  const [checkInStatus, setCheckInStatus] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const api = axios.create({
    baseURL: 'https://backend-8xbb.onrender.com/api',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // ✅ Stable fetchDevices using useCallback
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/devices/');
      setDevices(response.data.results);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load devices');
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [api, navigate]);

  // ✅ Properly include dependency
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registerDevice = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/devices/', formData);
      setDevices([...devices, response.data]);
      setFormData({
        device_id: '',
        name: '',
        location: '',
        version: ''
      });
    } catch (err) {
      console.error('Error registering device:', err);
      setError(err.response?.data || 'Failed to register device');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (deviceId) => {
    try {
      const response = await api.post(`/devices/${deviceId}/check_in/`);
      setCheckInStatus({
        deviceId,
        status: response.data.status,
        playlist: response.data.playlist,
        scheduleId: response.data.schedule_id
      });
      fetchDevices();
    } catch (err) {
      console.error('Error during check-in:', err);
      setError('Failed to check in device');
    }
  };

  const toggleDeviceStatus = async (deviceId, currentStatus) => {
    try {
      await api.patch(`/devices/${deviceId}/`, { is_active: !currentStatus });
      fetchDevices();
    } catch (err) {
      console.error('Error updating device status:', err);
      setError('Failed to update device status');
    }
  };

  return (
    <div className="device-manager">
      <h2>Device Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <button className="btn" onClick={() => navigate('/admin-dashboard')}>
        Back to Dashboard
      </button>

      {/* Registration Form */}
      <div className="device-form">
        <h3>Register New Device</h3>
        <form onSubmit={registerDevice}>
          <div className="form-group">
            <label>Device ID:</label>
            <input
              type="text"
              name="device_id"
              value={formData.device_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Device Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Version (optional):</label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Device'}
          </button>
        </form>
      </div>

      {/* Device List */}
      <div className="devices-list">
        <h3>Your Devices</h3>
        {loading && devices.length === 0 ? (
          <p>Loading devices...</p>
        ) : devices.length === 0 ? (
          <p>No devices registered yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(device => (
                <tr key={device.id}>
                  <td>{device.device_id}</td>
                  <td>{device.name}</td>
                  <td>{device.location}</td>
                  <td>{new Date(device.last_active).toLocaleString()}</td>
                  <td>
                    <span className={`status ${device.is_active ? 'active' : 'inactive'}`}>
                      {device.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => toggleDeviceStatus(device.id, device.is_active)}
                      className="toggle-btn"
                    >
                      {device.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleCheckIn(device.id)}
                      className="checkin-btn"
                    >
                      Check In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Check-in Status */}
      {checkInStatus && (
        <div className="checkin-status">
          <h3>Check-in Status for Device</h3>
          <p>Status: <strong>{checkInStatus.status}</strong></p>
          {checkInStatus.playlist && (
            <div>
              <p>Assigned Playlist: {checkInStatus.playlist.name}</p>
              <p>Schedule ID: {checkInStatus.scheduleId}</p>
            </div>
          )}
          <button onClick={() => setCheckInStatus(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
