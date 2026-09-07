// API Client for Backend Communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle fetch requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Product API calls
export const productAPI = {
  getAll: async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    return fetchAPI(`/products${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: async (id) => {
    return fetchAPI(`/products/${id}`);
  }
};

// Cart API calls
export const cartAPI = {
  get: async (sessionId) => {
    return fetchAPI(`/cart?sessionId=${sessionId}`);
  },
  
  add: async (productId, quantity, sessionId) => {
    return fetchAPI('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, sessionId })
    });
  },
  
  update: async (itemId, quantity) => {
    return fetchAPI(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  },
  
  remove: async (itemId) => {
    return fetchAPI(`/cart/${itemId}`, {
      method: 'DELETE'
    });
  },
  
  clear: async (sessionId) => {
    return fetchAPI('/cart/clear', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });
  }
};

// Order API calls
export const orderAPI = {
  checkout: async (sessionId, total) => {
    return fetchAPI('/checkout', {
      method: 'POST',
      body: JSON.stringify({ sessionId, total, status: 'pending' })
    });
  },
  
  getBySession: async (sessionId) => {
    return fetchAPI(`/orders/${sessionId}`);
  }
};

export default {
  products: productAPI,
  cart: cartAPI,
  orders: orderAPI
};
