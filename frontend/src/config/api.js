import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:4000/api';

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const auditAPI = {
  createAudit: (url) => api.post('/audit', { url }),
};

export const reportAPI = {
  getReportById: (id) => api.get(`/report/${id}`),
  getAdminReports: (page = 1, limit = 10) =>
    api.get('/report/admin/reports', { params: { page, limit } }),
};

export const adminAPI = {
  listAdmins: () => api.get('/admin/list'),
};

export const serviceAPI = {
  getWhatsAppNumber: () => api.get('/service/contact'),
  updateWhatsAppNumber: (whatsappNumber) => api.post('/service/contact', { whatsappNumber }),
  requestService: (payload) => api.post('/service/request', payload),
  listContracts: (page = 1, limit = 10) => api.get('/service/contracts', { params: { page, limit } }),
  startContract: (id) => api.post(`/service/contracts/${id}/start`),
  updateContractStatus: (id, data) => api.patch(`/service/contracts/${id}/status`, data),
  getProgressByKey: (uniqueKey) => api.get(`/service/progress/${uniqueKey}`),
};

export default api;


