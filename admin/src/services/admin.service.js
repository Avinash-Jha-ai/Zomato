import API from '../utils/axios';

export const adminLogin = (data) => API.post('/auth/login', data).then(r => r.data);
export const getStats = () => API.get('/admin/stats').then(r => r.data);
export const getAllOrders = () => API.get('/admin/orders').then(r => r.data);
export const updateOrderStatus = (id, status) => API.put(`/admin/order/${id}`, { status }).then(r => r.data);
export const getAllProducts = () => API.get('/product/').then(r => r.data);
export const deleteProduct = (id) => API.delete(`/product/delete/${id}`).then(r => r.data);
export const updateProduct = (id, data) => API.put(`/product/update/${id}`, data).then(r => r.data);
export const uploadProduct = (formData) => API.post('/product/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const getHeroSections = () => API.get('/hero/').then(r => r.data);
export const deleteHeroSection = (id) => API.delete(`/hero/delete/${id}`).then(r => r.data);
export const uploadHero = (formData) => API.post('/hero/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
