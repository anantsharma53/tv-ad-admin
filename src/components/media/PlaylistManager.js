import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaylistManager.css'; // Create this CSS file for styling
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = 'https://backend-8xbb.onrender.com/api/'; // Replace with your actual API URL

const PlaylistManager = () => {
    const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [showRemoveMediaModal, setShowRemoveMediaModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Initialize by getting the token from localStorage
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setToken(authToken);
    } else {
      alert("Authentication Required: Please login to access playlists");
      // Optionally redirect to login here
    }
  }, []);

  // Configure axios instance with token
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Fetch all playlists
  const fetchPlaylists = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await api.get('/playlists/');
      setPlaylists(response.data.results);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert('Failed to fetch playlists');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch all media items
  const fetchMediaItems = async () => {
    if (!token) return;
    
    try {
      const response = await api.get('/media/');
    //   meia
      setMediaItems(response.data.results);
    } catch (error) {
      console.error('Error fetching media items:', error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert('Failed to fetch media items');
      }
    }
  };

  // Handle 401 unauthorized errors
  const handleUnauthorized = () => {
    localStorage.removeItem("authToken");
    alert("Session Expired: Please login again");
    // Optionally redirect to login here
  };

  useEffect(() => {
    if (token) {
      fetchPlaylists();
      fetchMediaItems();
    }
  }, [token]);

  // Create a new playlist
  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      alert('Playlist name cannot be empty');
      return;
    }

    try {
      const response = await api.post('/playlists/', { 
        name: newPlaylistName, 
        description: '' 
      });
      setPlaylists([...playlists, response.data]);
      setNewPlaylistName('');
      setShowCreateModal(false);
      alert('Playlist created successfully');
    } catch (error) {
      console.error('Error creating playlist:', error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert('Failed to create playlist');
      }
    }
  };

  // Add media to playlist
  const addMediaToPlaylist = async () => {
    if (!selectedPlaylist || selectedMedia.length === 0) {
      alert('Please select a playlist and at least one media item');
      return;
    }

    try {
      await api.post(
        `/playlists/${selectedPlaylist.id}/add_item/`,
        { media_id: selectedMedia[0].id }
      );
      
      fetchPlaylists();
      setSelectedMedia([]);
      setShowAddMediaModal(false);
      alert('Media added to playlist');
    } catch (error) {
      console.error('Error adding media to playlist:', error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert('Failed to add media to playlist');
      }
    }
  };

  // Remove media from playlist
  const removeMediaFromPlaylist = async () => {
    if (!selectedPlaylist || selectedMedia.length === 0) {
      alert('Please select a playlist and at least one media item');
      return;
    }

    try {
      await api.post(
        `/playlists/${selectedPlaylist.id}/remove_item/`,
        { media_id: selectedMedia[0].id }
      );
      
      fetchPlaylists();
      setSelectedMedia([]);
      setShowRemoveMediaModal(false);
      alert('Media removed from playlist');
    } catch (error) {
      console.error('Error removing media from playlist:', error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert('Failed to remove media from playlist');
      }
    }
  };

  // Delete a playlist
  const deletePlaylist = async (playlistId) => {
    try {
      await api.delete(`/playlists/${playlistId}/`);
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      alert('Playlist deleted successfully');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert('Failed to delete playlist');
      }
    }
  };

  // Toggle media selection
  const toggleMediaSelection = (media) => {
    setSelectedMedia([media]);
  };

  if (!token) {
    return (
      <div className="container">
        <p>Loading or authentication required...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title">My Playlists</h2>
      
      {/* Create Playlist Button */}
      <button 
        className="btn"
        onClick={() => setShowCreateModal(true)}
        style={{ marginRight: '10px' }}
      >
        Create New Playlist
      </button>
      <button 
        className="btn"
        onClick={() => navigate('/admin-dashboard')}
            >
                Back to Dashboard
      </button>

      {/* Playlists List */}
      {loading ? (
        <p>Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p>No playlists found. Create one to get started!</p>
      ) : (
        <div className="playlist-list">
          {playlists.map(item => (
            <div key={item.id} className="playlist-item">
              <h3 className="playlist-name">{item.name}</h3>
              <p>{item.items?.length || 0} items</p>
              
              <div className="playlist-actions">
                <button 
                  className="btn small-btn"
                  onClick={() => {
                    setSelectedPlaylist(item);
                    setShowAddMediaModal(true);
                  }}
                >
                  Add Media
                </button>
                
                {item.items?.length > 0 && (
                  <button 
                    className="btn small-btn"
                    onClick={() => {
                      setSelectedPlaylist(item);
                      setShowRemoveMediaModal(true);
                    }}
                  >
                    Remove Media
                  </button>
                )}
                
                <button 
                  className="btn small-btn delete-btn"
                  onClick={() => deletePlaylist(item.id)}
                >
                  Delete
                </button>
              </div>
              
              {/* Show playlist items if available */}
              {item.items?.length > 0 && (
                <div className="playlist-items-container">
                  <h4 className="subtitle">Playlist Items:</h4>
                  <ul className="media-list">
                    {item.items.map(media => (
                      <li key={media.id} className="media-in-playlist">
                        {media.title} ({media.media_type})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">Create New Playlist</h3>
            
            <label className="label">Playlist Name</label>
            <input
              className="input"
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
            />
            
            <div className="modal-buttons">
              <button 
                className="btn cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              
              <button 
                className="btn"
                onClick={createPlaylist}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Media to Playlist Modal */}
      {showAddMediaModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">
              Add Media to {selectedPlaylist?.name}
            </h3>
            
            <ul className="media-list">
              {mediaItems.map(item => (
                <li
                  key={item.id}
                  className={`media-item ${
                    selectedMedia.some(m => m.id === item.id) ? 'selected' : ''
                  }`}
                  onClick={() => toggleMediaSelection(item)}
                >
                  <span className="media-title">{item.title}</span>
                  <span className="media-type">{item.media_type}</span>
                  {item.duration && <span className="media-duration">{item.duration}s</span>}
                </li>
              ))}
            </ul>
            
            <div className="modal-buttons">
              <button 
                className="btn cancel-btn"
                onClick={() => {
                  setShowAddMediaModal(false);
                  setSelectedMedia([]);
                }}
              >
                Cancel
              </button>
              
              <button 
                className="btn"
                onClick={addMediaToPlaylist}
                disabled={selectedMedia.length === 0}
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Media from Playlist Modal */}
      {showRemoveMediaModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">
              Remove Media from {selectedPlaylist?.name}
            </h3>
            
            {selectedPlaylist?.items?.length > 0 ? (
              <ul className="media-list">
                {selectedPlaylist.items.map(item => (
                  <li
                    key={item.id}
                    className={`media-item ${
                      selectedMedia.some(m => m.id === item.id) ? 'selected' : ''
                    }`}
                    onClick={() => toggleMediaSelection(item)}
                  >
                    <span className="media-title">{item.title}</span>
                    <span className="media-type">{item.media_type}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>This playlist has no items to remove</p>
            )}
            
            <div className="modal-buttons">
              <button 
                className="btn cancel-btn"
                onClick={() => {
                  setShowRemoveMediaModal(false);
                  setSelectedMedia([]);
                }}
              >
                Cancel
              </button>
              
              <button 
                className="btn"
                onClick={removeMediaFromPlaylist}
                disabled={selectedMedia.length === 0 || selectedPlaylist?.items?.length === 0}
              >
                Remove Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;