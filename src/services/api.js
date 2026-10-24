const API_BASE = '/api';

function getAuthToken() {
  return localStorage.getItem('drawx_token');
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Discard invalid token
      localStorage.removeItem('drawx_token');
      localStorage.removeItem('drawx_user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  signup: (payload) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => apiRequest('/auth/me'),
  updateSettings: (payload) => apiRequest('/auth/settings', { method: 'PUT', body: JSON.stringify(payload) }),

  // Lists
  getLists: () => apiRequest('/lists'),
  getBuiltInLists: () => apiRequest('/lists/built-in'),
  getList: (id) => apiRequest(`/lists/${id}`),
  createList: (payload) => apiRequest('/lists', { method: 'POST', body: JSON.stringify(payload) }),
  updateList: (id, payload) => apiRequest(`/lists/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteList: (id) => apiRequest(`/lists/${id}`, { method: 'DELETE' }),
  seedPreset: (presetKey) => apiRequest('/lists/seed-preset', { method: 'POST', body: JSON.stringify({ presetKey }) }),

  // Practice Sessions
  getActiveSession: () => apiRequest('/sessions/active'),
  startSession: (payload) => apiRequest('/sessions/start', { method: 'POST', body: JSON.stringify(payload) }),
  sessionAction: (sessionId, action, objectName) =>
    apiRequest(`/sessions/${sessionId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, objectName })
    }),
  cancelSession: (sessionId) => apiRequest(`/sessions/${sessionId}/cancel`, { method: 'POST' }),

  // Dashboard
  getDashboardStats: () => apiRequest('/dashboard/stats'),

  // History
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/history${query ? `?${query}` : ''}`);
  },
  getUniqueCompleted: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/history/unique-completed${query ? `?${query}` : ''}`);
  },

  // Leaderboard
  getLeaderboard: () => apiRequest('/leaderboard'),

  // AI Prompt Generation
  generateAIPrompts: (payload) => apiRequest('/ai/generate', { method: 'POST', body: JSON.stringify(payload) }),
  appendPromptsToList: (payload) => apiRequest('/ai/append-to-list', { method: 'POST', body: JSON.stringify(payload) }),

  // System
  getHealth: () => apiRequest('/health')
};
