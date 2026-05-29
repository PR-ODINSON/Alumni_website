import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 + token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
          { refreshToken }
        );

        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Typed API helpers
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
};

export const alumniApi = {
  getAll: (params?: any) => api.get('/alumni', { params }),
  getProfile: (userId: string) => api.get(`/alumni/${userId}`),
  updateProfile: (data: any) => api.put('/alumni/profile/me', data),
  addCareerEntry: (data: any) => api.post('/alumni/profile/career', data),
  updateCareerEntry: (entryId: string, data: any) => api.put(`/alumni/profile/career/${entryId}`, data),
  deleteCareerEntry: (entryId: string) => api.delete(`/alumni/profile/career/${entryId}`),
  getMentors: (params?: any) => api.get('/alumni/mentors', { params }),
  getStats: () => api.get('/alumni/stats'),
  getDistinguished: () => api.get('/alumni/distinguished'),
  getStartups: () => api.get('/alumni/startups'),
  getStartupEcosystem: () => api.get('/alumni/startups'),
};

export const studentApi = {
  getAll: (params?: any) => api.get('/students', { params }),
  getProfile: (userId: string) => api.get(`/students/${userId}`),
  updateProfile: (data: any) => api.put('/students/profile/me', data),
};

export const researchApi = {
  getAll: (params?: any) => api.get('/research', { params }),
  getOne: (id: string) => api.get(`/research/${id}`),
  create: (data: any) => api.post('/research', data),
  apply: (id: string, data: any) => api.post(`/research/${id}/apply`, data),
};

export const userApi = {
  search: (params?: any) => api.get('/users/search', { params }),
  getUser: (userId: string) => api.get(`/users/${userId}`),
  updateProfile: (data: any) => api.patch('/users/profile', data),
};

export const postApi = {
  getFeed: (params?: any) => api.get('/posts', { params }),
  getPost: (postId: string) => api.get(`/posts/${postId}`),
  createPost: (data: any) => api.post('/posts', data),
  updatePost: (postId: string, data: any) => api.put(`/posts/${postId}`, data),
  deletePost: (postId: string) => api.delete(`/posts/${postId}`),
  likePost: (postId: string) => api.post(`/posts/${postId}/like`),
  getComments: (postId: string, params?: any) => api.get(`/posts/${postId}/comments`, { params }),
  addComment: (postId: string, data: any) => api.post(`/posts/${postId}/comments`, data),
  likeComment: (commentId: string) => api.post(`/posts/comments/${commentId}/like`),
  deleteComment: (commentId: string) => api.delete(`/posts/comments/${commentId}`),
};

export const jobApi = {
  getAll: (params?: any) => api.get('/jobs', { params }),
  getJob: (jobId: string) => api.get(`/jobs/${jobId}`),
  createJob: (data: any) => api.post('/jobs', data),
  updateJob: (jobId: string, data: any) => api.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId: string) => api.delete(`/jobs/${jobId}`),
  applyToJob: (jobId: string, data: any) => api.post(`/jobs/${jobId}/apply`, data),
  saveJob: (jobId: string) => api.post(`/jobs/${jobId}/save`),
  getSaved: () => api.get('/jobs/me/saved'),
  getApplications: () => api.get('/jobs/me/applications'),
  getMyPosted: () => api.get('/jobs/me/posted'),
};

export const eventApi = {
  getAll: (params?: any) => api.get('/events', { params }),
  getEvent: (eventId: string) => api.get(`/events/${eventId}`),
  createEvent: (data: any) => api.post('/events', data),
  updateEvent: (eventId: string, data: any) => api.put(`/events/${eventId}`, data),
  register: (eventId: string, data?: any) => api.post(`/events/${eventId}/register`, data),
  cancelRegistration: (eventId: string) => api.delete(`/events/${eventId}/register`),
  getMyEvents: () => api.get('/events/me/registered'),
};

export const mentorshipApi = {
  request: (data: any) => api.post('/mentorship/request', data),
  getAll: (params?: any) => api.get('/mentorship', { params }),
  getOne: (id: string) => api.get(`/mentorship/${id}`),
  respond: (id: string, data: any) => api.patch(`/mentorship/${id}/respond`, data),
  scheduleSession: (id: string, data: any) => api.post(`/mentorship/${id}/sessions`, data),
  updateSession: (id: string, sessionId: string, data: any) => api.patch(`/mentorship/${id}/sessions/${sessionId}`, data),
  submitFeedback: (id: string, data: any) => api.post(`/mentorship/${id}/feedback`, data),
  complete: (id: string) => api.patch(`/mentorship/${id}/complete`),
};

export const connectionApi = {
  sendRequest: (userId: string, data?: any) => api.post(`/connections/request/${userId}`, data),
  respond: (connectionId: string, action: 'accept' | 'reject') => api.patch(`/connections/${connectionId}/respond`, { action }),
  getConnections: (userId?: string) => api.get(`/connections/${userId || 'me'}`),
  getPending: () => api.get('/connections/pending'),
  getStatus: (userId: string) => api.get(`/connections/status/${userId}`),
  remove: (connectionId: string) => api.delete(`/connections/${connectionId}`),
  getMutual: (userId: string) => api.get(`/connections/mutual/${userId}`),
};

export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  createConversation: (participantId: string) => api.post('/messages/conversations', { participantId }),
  getMessages: (conversationId: string, params?: any) => api.get(`/messages/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId: string, data: any) => api.post(`/messages/conversations/${conversationId}/messages`, data),
};

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getAlumniDistribution: () => api.get('/analytics/alumni-distribution'),
  getGlobalPresence: () => api.get('/analytics/global-presence'),
  getPlacementStats: () => api.get('/analytics/placement-stats'),
  getStartupStats: () => api.get('/analytics/startup-stats'),
};

export const successStoryApi = {
  getAll: (params?: any) => api.get('/success-stories', { params }),
  getOne: (id: string) => api.get(`/success-stories/${id}`),
  create: (data: any) => api.post('/success-stories', data),
  update: (id: string, data: any) => api.put(`/success-stories/${id}`, data),
  like: (id: string) => api.post(`/success-stories/${id}/like`),
};

export const notificationApi = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  markAllRead: () => api.patch('/notifications/read-all'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

export const uploadApi = {
  image: (formData: FormData) => api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  document: (formData: FormData) => api.post('/upload/document', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadImage: (file: File, folder?: string) => {
    const form = new FormData();
    form.append('image', file);
    if (folder) form.append('folder', folder);
    return api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadDocument: (file: File) => {
    const form = new FormData();
    form.append('document', file);
    return api.post('/upload/document', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
