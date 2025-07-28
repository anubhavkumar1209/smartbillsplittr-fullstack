import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const authService = {
  api: axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  }),

  setAuthToken: (token) => {
    if (token) {
      authService.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete authService.api.defaults.headers.common['Authorization'];
    }
  },

  register: async (userData) => {
    try {
      console.log('📤 Registering user:', userData);
      const response = await authService.api.post('/auth/signup', userData);
      console.log('✅ Registration successful:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('📤 Attempting login:', credentials);
      const response = await authService.api.post('/auth/signin', credentials);
      console.log('✅ Login successful:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.status, error.response?.data || error.message);
      throw error;
    }
  }
};

export { authService };
