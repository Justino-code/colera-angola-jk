const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://0.0.0.0:8000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Remove / inicial duplicado no endpoint
  const cleanEndpoint = endpoint.replace(/^\//, '');

  console.log('➡ URL chamada:', `${API_URL}/${cleanEndpoint}`);
  console.log('➡ Método:', options.method, 'Headers:', headers, 'Body:', options.body);

  const response = await fetch(`${API_URL}/${cleanEndpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  return response.json();
}

export default {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
