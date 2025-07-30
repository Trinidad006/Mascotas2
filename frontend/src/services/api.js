import axios from 'axios';

// Usar siempre la URL de Render para evitar problemas de conexión local
const API_URL = 'https://mascotas2.onrender.com';

// Configurar axios con interceptores para el token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Servicios de mascotas
export const petService = {
  getAll: async () => {
    const response = await api.get('/pets');
    return response.data;
  },
  
  create: async (petData) => {
    const response = await api.post('/pets', petData);
    return response.data;
  },
  
  update: async (id, petData) => {
    const response = await api.put(`/pets/${id}`, petData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  },
  
  // Acciones de mascotas
  dormir: async (id) => {
    const response = await api.post(`/pets/${id}/dormir`);
    return response.data;
  },
  
  jugar: async (id) => {
    const response = await api.post(`/pets/${id}/jugar`);
    return response.data;
  },
  
  alimentar: async (id) => {
    const response = await api.post(`/pets/${id}/alimentar`);
    return response.data;
  },
  
  banar: async (id) => {
    const response = await api.post(`/pets/${id}/banar`);
    return response.data;
  },
  
  acariciar: async (id) => {
    const response = await api.post(`/pets/${id}/acariciar`);
    return response.data;
  },
  
  curar: async (id) => {
    const response = await api.post(`/pets/${id}/curar`);
    return response.data;
  },
  
  getVida: async (id) => {
    const response = await api.get(`/pets/${id}/vida`);
    return response.data;
  }
};

// Servicios de usuarios
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default api; 