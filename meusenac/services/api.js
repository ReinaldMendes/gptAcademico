import axios from 'axios';

const api = axios.create({
  baseURL: 'https://meuappsenac.onrender.com',
});

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const signup = async (name, email, password, role) => {
  const response = await api.post('/signup', { name, email, password, role });
  return response.data;
};

// Outros métodos CRUD podem ser adicionados aqui

export default api;
