const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Don't stringify FormData
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setAuthToken(null);
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { token, password },
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async calculatePrice(productId, customization) {
    return this.request(`/products/${productId}/calculate-price`, {
      method: 'POST',
      body: customization,
    });
  }

  async getProductsByCategory(categoryId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/category/${categoryId}?${queryString}`);
  }

  async getFeaturedProducts(limit = 6) {
    return this.request(`/products/featured/list?limit=${limit}`);
  }

  async searchProducts(query, params = {}) {
    const searchParams = new URLSearchParams({ q: query, ...params }).toString();
    return this.request(`/products/search/query?${searchParams}`);
  }

  // Order methods
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id, reason) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: { reason },
    });
  }

  async trackOrder(id, orderNumber = null) {
    const params = orderNumber ? `?orderNumber=${orderNumber}` : '';
    return this.request(`/orders/${id}/track${params}`);
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: userData,
    });
  }

  async getUserDashboard() {
    return this.request('/users/dashboard');
  }

  async updateNotificationPreferences(preferences) {
    return this.request('/users/notifications', {
      method: 'PUT',
      body: preferences,
    });
  }

  // Upload methods
  async uploadDesign(file) {
    const formData = new FormData();
    formData.append('design', file);

    return this.request('/upload/design', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async uploadMultipleDesigns(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('designs', file);
    });

    return this.request('/upload/designs', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async getUserFiles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/upload/my-files?${queryString}`);
  }

  async deleteFile(cloudinaryId) {
    return this.request(`/upload/${cloudinaryId}`, {
      method: 'DELETE',
    });
  }

  // Payment methods
  async getPaymentMethods() {
    return this.request('/payments/methods');
  }

  async createStripeIntent(orderId, amount) {
    return this.request('/payments/stripe/create-intent', {
      method: 'POST',
      body: { orderId, amount },
    });
  }

  async confirmStripePayment(paymentIntentId) {
    return this.request('/payments/stripe/confirm', {
      method: 'POST',
      body: { paymentIntentId },
    });
  }

  async createRazorpayOrder(orderId, amount) {
    return this.request('/payments/razorpay/create-order', {
      method: 'POST',
      body: { orderId, amount },
    });
  }

  async verifyRazorpayPayment(paymentData) {
    return this.request('/payments/razorpay/verify', {
      method: 'POST',
      body: paymentData,
    });
  }

  async confirmCODOrder(orderId) {
    return this.request('/payments/cod/confirm', {
      method: 'POST',
      body: { orderId },
    });
  }

  async reportPaymentFailure(orderId, reason) {
    return this.request('/payments/failure', {
      method: 'POST',
      body: { orderId, reason },
    });
  }

  // Bulk order methods
  async submitBulkOrderEnquiry(enquiryData) {
    return this.request('/bulk-orders', {
      method: 'POST',
      body: enquiryData,
    });
  }

  async getBulkOrderEnquiries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bulk-orders?${queryString}`);
  }
}

export default new ApiService();