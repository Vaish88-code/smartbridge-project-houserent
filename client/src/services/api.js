import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        // Only fire auth-error if the request was NOT to /auth/me (initial auth check)
        // and NOT to /auth/login or /auth/register (login/register attempts)
        const url = error.config?.url || '';
        const isAuthRoute = url.includes('/auth/me') || url.includes('/auth/login') || url.includes('/auth/register');
        if (!isAuthRoute) {
          // Token expired or invalid - clear local state
          window.dispatchEvent(new Event('auth-error'));
        }
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: 'Network error. Please check your connection.' });
  }
);

// ==================== Auth APIs ====================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ==================== User APIs ====================
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

// ==================== Property APIs ====================
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => {
    return api.post('/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    return api.put(`/properties/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/properties/${id}`),
  getMyProperties: () => api.get('/properties/my-properties'),
};

// ==================== Booking APIs ====================
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getReceived: () => api.get('/bookings/received'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

// ==================== Admin APIs ====================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/status`),
  getProperties: (params) => api.get('/admin/properties', { params }),
  approveProperty: (id) => api.patch(`/admin/properties/${id}/approve`),
  rejectProperty: (id) => api.patch(`/admin/properties/${id}/reject`),
  removeProperty: (id) => api.delete(`/admin/properties/${id}`),
  getBookings: (params) => api.get('/admin/bookings', { params }),
};

export default api;
