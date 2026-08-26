import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getExams = () => api.get('/exams');
export const createExam = (data) => api.post('/exams/create', data);
export const getExam = (slug) => api.get(`/exams/${slug}`);
export const getHistory = (slug, category) =>
  api.get(`/exams/${slug}/history`, { params: { category } });
export const getPrediction = (slug, category, sessionId) =>
  api.get(`/exams/${slug}/predict`, { params: { category, sessionId } });
export const getStats = (slug, sessionId) =>
  api.get(`/exams/${slug}/stats`, { params: { sessionId } });
export const submitScore = (data) => api.post('/submissions', data);
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getUserSubmissions = () => api.get('/user/submissions');

export default api;
