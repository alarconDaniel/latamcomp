const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

const AUTH_KEY = 'colcom_auth';

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  } catch {
    return null;
  }
};

export const setStoredAuth = (value) => {
  if (!value) {
    localStorage.removeItem(AUTH_KEY);
    return;
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(value));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('colcom:auth-expired'));
};

export const toQuery = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : '';
};

const parseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const refreshAccessToken = async () => {
  const stored = getStoredAuth();
  if (!stored?.refreshToken) return null;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: stored.refreshToken }),
  });

  if (!response.ok) return null;
  const data = await parseBody(response);
  const nextAuth = {
    ...stored,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || stored.refreshToken,
  };
  setStoredAuth(nextAuth);
  return nextAuth.accessToken;
};

export const apiRequest = async (path, options = {}, retry = true) => {
  const stored = getStoredAuth();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');
  if (stored?.accessToken) headers.set('Authorization', `Bearer ${stored.accessToken}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  });

  const payload = await parseBody(response);

  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) return apiRequest(path, options, false);
    clearStoredAuth();
  }

  if (!response.ok) {
    const error = new Error(payload?.message || 'Error de comunicación con el servidor');
    error.status = response.status;
    error.details = payload?.details || null;
    throw error;
  }

  return payload;
};
