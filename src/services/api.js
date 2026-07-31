import axios from 'axios';

// Create base Axios instance for DevTrack Backend (which proxies to Gitea)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- Authentication ---
export const authService = {
  login: async (token) => {
    const response = await api.post('/auth/login', { token });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  // Get current Gitea user from proxy
  getCurrentUser: async () => {
    const response = await api.get('/gitea/user');
    return response.data;
  }
};

// --- Gitea Data (Proxied) ---
export const repositoryService = {
  // Get repos for the current user
  getAll: async () => {
    const response = await api.get('/gitea/user/repos');
    return response.data;
  },
  // Get specific repo by owner and name
  getByName: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}`);
    return response.data;
  }
};

export const commitService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/commits`);
    return response.data;
  }
};

export const branchService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/branches`);
    return response.data;
  }
};

export const issueService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/issues`);
    return response.data;
  }
};

export const prService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/pulls`);
    return response.data;
  }
};

// --- Custom DevTrack Backend Data ---
export const attendanceService = {
  getLogs: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },
  checkIn: async (username) => {
    const response = await api.post('/attendance', { username, type: 'check-in' });
    return response.data;
  },
  checkOut: async (username) => {
    const response = await api.post('/attendance', { username, type: 'check-out' });
    return response.data;
  }
};

export const developerService = {
  getAll: async () => {
    const response = await api.get('/developers');
    return response.data;
  }
};

export default api;
