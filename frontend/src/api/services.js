import api from './http';

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload)
};

const crud = (path) => ({
  list: (params) => api.get(path, { params }),
  get: (id) => api.get(`${path}/${id}`),
  create: (data) => api.post(path, data),
  update: (id, data) => api.put(`${path}/${id}`, data),
  remove: (id) => api.delete(`${path}/${id}`)
});

export const dashboardApi = { stats: () => api.get('/dashboard') };
export const studentsApi = {
  ...crud('/students'),
  uploadPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/students/${id}/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
};
export const coursesApi = crud('/courses');
export const staffApi = crud('/staff');
export const attendanceApi = {
  list: (params) => api.get('/attendance', { params }),
  mark: (payload) => api.post('/attendance/mark', payload),
  report: (params) => api.get('/attendance/report', { params })
};
export const marksApi = {
  list: (params) => api.get('/marks', { params }),
  save: (payload) => api.post('/marks', payload),
  result: (studentId, semester) => api.get(`/marks/results/${studentId}`, { params: { semester } })
};
export const feesApi = {
  list: (params) => api.get('/fees', { params }),
  save: (payload) => api.post('/fees', payload),
  receipt: (id) => api.get(`/fees/${id}/receipt`, { responseType: 'blob' }),
  summary: () => api.get('/fees/summary')
};
export const reportsApi = {
  excel: (type) => api.get(`/reports/${type}/excel`, { responseType: 'blob' }),
  pdf: (type) => api.get(`/reports/${type}/pdf`, { responseType: 'blob' })
};
