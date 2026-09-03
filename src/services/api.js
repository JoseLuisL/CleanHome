/**
 * Cliente HTTP base para llamadas a APIs.
 * Centraliza baseURL, headers y manejo de errores.
 * Cambia BASE_URL por tu backend real cuando este disponible.
 */
const BASE_URL = 'https://api.limpiezahogar.example.com';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // En este demo relanzamos el error para que cada servicio decida el fallback.
    throw error;
  }
}

export default {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
