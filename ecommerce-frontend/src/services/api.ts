import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Products
  getProducts: () => api.get('/products'),

  // Cart
  getCart: (userId: string) => api.get(`/cart/${userId}`),
  addToCart: (userId: string, productId: string, quantity: number) =>
    api.post(`/cart/${userId}/items`, { productId, quantity }),
  updateCartItem: (userId: string, productId: string, quantity: number) =>
    api.put(`/cart/${userId}/items/${productId}`, { quantity }),
  removeFromCart: (userId: string, productId: string) =>
    api.delete(`/cart/${userId}/items/${productId}`),
  applyDiscount: (userId: string, code: string) =>
    api.post(`/cart/${userId}/discount`, { code }),
  removeDiscount: (userId: string) =>
    api.delete(`/cart/${userId}/discount`),

  // Checkout
  checkout: (userId: string) => api.post(`/checkout/${userId}`),
  validateDiscount: (code: string) => api.get(`/discount/validate/${code}`),

  // Admin
  getAdminStats: () => api.get('/admin/stats'),
  getDiscountCodes: () => api.get('/admin/discount-codes'),

  getAvailableDiscounts: (userId: string) =>
    api.get(`/discounts/available/${userId}`),

  // ✅ ADD THIS: Generate test discount (for testing)
  generateTestDiscount: (code?: string, discountPercent?: number) =>
    api.post('/discounts/generate-test', { code, discountPercent }),
};

export default api;