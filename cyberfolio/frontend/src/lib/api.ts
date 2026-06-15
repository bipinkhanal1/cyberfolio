import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && error.response?.data?.code === 'TOKEN_EXPIRED') {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// API functions
// ========================

// Profile
export const getProfile = () => api.get('/profile').then(r => r.data.profile);
export const updateProfile = (data: any) => api.put('/profile', data).then(r => r.data.profile);

// Projects
export const getProjects = (params?: any) => api.get('/projects', { params }).then(r => r.data);
export const getProject = (slug: string) => api.get(`/projects/${slug}`).then(r => r.data.project);
export const getAdminProjects = () => api.get('/projects/admin/all').then(r => r.data.projects);
export const createProject = (data: any) => api.post('/projects', data).then(r => r.data.project);
export const updateProject = (id: string, data: any) => api.put(`/projects/${id}`, data).then(r => r.data.project);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Blog
export const getPosts = (params?: any) => api.get('/blog', { params }).then(r => r.data);
export const getPost = (slug: string) => api.get(`/blog/${slug}`).then(r => r.data.post);
export const getAdminPosts = () => api.get('/blog/admin/all').then(r => r.data.posts);
export const createPost = (data: any) => api.post('/blog', data).then(r => r.data.post);
export const updatePost = (id: string, data: any) => api.put(`/blog/${id}`, data).then(r => r.data.post);
export const deletePost = (id: string) => api.delete(`/blog/${id}`);

// Certifications
export const getCertifications = () => api.get('/certifications').then(r => r.data.certifications);
export const createCertification = (data: any) => api.post('/certifications', data).then(r => r.data.certification);
export const updateCertification = (id: string, data: any) => api.put(`/certifications/${id}`, data).then(r => r.data.certification);
export const deleteCertification = (id: string) => api.delete(`/certifications/${id}`);

// Skills
export const getSkills = () => api.get('/skills').then(r => r.data);
export const createSkill = (data: any) => api.post('/skills', data).then(r => r.data.skill);
export const updateSkill = (id: string, data: any) => api.put(`/skills/${id}`, data).then(r => r.data.skill);
export const deleteSkill = (id: string) => api.delete(`/skills/${id}`);

// Services
export const getServices = () => api.get('/services').then(r => r.data.services);
export const createService = (data: any) => api.post('/services', data).then(r => r.data.service);
export const updateService = (id: string, data: any) => api.put(`/services/${id}`, data).then(r => r.data.service);
export const deleteService = (id: string) => api.delete(`/services/${id}`);

// Testimonials
export const getTestimonials = () => api.get('/testimonials').then(r => r.data.testimonials);
export const getAdminTestimonials = () => api.get('/testimonials/admin/all').then(r => r.data.testimonials);
export const createTestimonial = (data: any) => api.post('/testimonials', data).then(r => r.data.testimonial);
export const updateTestimonial = (id: string, data: any) => api.put(`/testimonials/${id}`, data).then(r => r.data.testimonial);
export const deleteTestimonial = (id: string) => api.delete(`/testimonials/${id}`);

// Contact
export const sendContact = (data: any) => api.post('/contact', data);
export const getContacts = (params?: any) => api.get('/contact', { params }).then(r => r.data);
export const updateContactStatus = (id: string, status: string) => api.patch(`/contact/${id}/status`, { status });
export const deleteContact = (id: string) => api.delete(`/contact/${id}`);

// FAQs
export const getFAQs = (params?: any) => api.get('/faq', { params }).then(r => r.data.faqs);
export const createFAQ = (data: any) => api.post('/faq', data).then(r => r.data.faq);
export const updateFAQ = (id: string, data: any) => api.put(`/faq/${id}`, data).then(r => r.data.faq);
export const deleteFAQ = (id: string) => api.delete(`/faq/${id}`);

// Settings
export const getSettings = (group?: string) => api.get('/settings', { params: { group } }).then(r => r.data.settings);
export const updateSettings = (data: any) => api.put('/settings', data);

// Analytics
export const getAnalyticsSummary = () => api.get('/analytics/summary').then(r => r.data);
export const trackPageView = (path: string) => api.post('/analytics/track', { path }).catch(() => {});

// Media
export const getMedia = (params?: any) => api.get('/media', { params }).then(r => r.data);
export const uploadMedia = (formData: FormData) =>
  api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.media);
export const deleteMedia = (id: string) => api.delete(`/media/${id}`);

// Auth
export const login = (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials).then(r => r.data);
export const logout = (refreshToken: string) => api.post('/auth/logout', { refreshToken });
export const getMe = () => api.get('/auth/me').then(r => r.data.user);
export const changePassword = (data: any) => api.post('/auth/change-password', data);
export const refreshToken = (token: string) => api.post('/auth/refresh', { refreshToken: token }).then(r => r.data);
