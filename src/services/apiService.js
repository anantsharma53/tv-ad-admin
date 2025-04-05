// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add auth token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const authService = {
//   login: (credentials) => api.post('auth/login/', credentials),
//   getCurrentUser: () => api.get('users/me/'),
// };

// export const userService = {
//   register: (userData) => api.post('users/register/', userData),
//   getAll: () => api.get('users/'),
//   getById: (id) => api.get(`users/${id}/`),
//   update: (id, userData) => api.put(`users/${id}/`, userData),
//   delete: (id) => api.delete(`users/${id}/`),
// };

// export const deviceService = {
//   getAll: () => api.get('devices/'),
//   getById: (id) => api.get(`devices/${id}/`),
//   create: (deviceData) => api.post('devices/', deviceData),
//   update: (id, deviceData) => api.put(`devices/${id}/`, deviceData),
//   delete: (id) => api.delete(`devices/${id}/`),
//   checkIn: (id) => api.post(`devices/${id}/check_in/`),
// };

// export const mediaService = {
//   getAll: () => api.get('media/'),
//   getById: (id) => api.get(`media/${id}/`),
//   create: (formData) => api.post('media/', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   }),
//   update: (id, formData) => api.put(`media/${id}/`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   }),
//   delete: (id) => api.delete(`media/${id}/`),
// };

// export const playlistService = {
//   getAll: () => api.get('playlists/'),
//   getById: (id) => api.get(`playlists/${id}/`),
//   create: (playlistData) => api.post('playlists/', playlistData),
//   update: (id, playlistData) => api.put(`playlists/${id}/`, playlistData),
//   delete: (id) => api.delete(`playlists/${id}/`),
//   addItem: (id, mediaId) => api.post(`playlists/${id}/add_item/`, { media_id: mediaId }),
//   removeItem: (id, mediaId) => api.post(`playlists/${id}/remove_item/`, { media_id: mediaId }),
// };

// export const scheduleService = {
//   getAll: () => api.get('schedules/'),
//   getById: (id) => api.get(`schedules/${id}/`),
//   create: (scheduleData) => api.post('schedules/', scheduleData),
//   update: (id, scheduleData) => api.put(`schedules/${id}/`, scheduleData),
//   delete: (id) => api.delete(`schedules/${id}/`),
// };

// export const logService = {
//   getByDevice: (deviceId) => api.get('logs/', { params: { device_id: deviceId } }),
//   getAll: () => api.get('logs/'),
// };

// export default api;