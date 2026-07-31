import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create base Axios instance — reads token from localStorage on every request
const api = axios.create({ baseURL: BASE_URL });

// Attach the Gitea token automatically from localStorage on every request
api.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem('devtrack-auth') || '{}');
    const token = auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

// --- Authentication ---
export const authService = {
  login: async (token) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, { token });
    // Persist token in localStorage after successful login
    if (response.data?.user) {
      const existing = JSON.parse(localStorage.getItem('devtrack-auth') || '{}');
      localStorage.setItem('devtrack-auth', JSON.stringify({ ...existing, token }));
    }
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('devtrack-auth');
  },
  getCurrentUser: async () => {
    const response = await api.get('/gitea/user');
    return response.data;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA MAPPERS  — translate Gitea JSON → DevTrack shape
// ─────────────────────────────────────────────────────────────────────────────

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#2b7489', Python: '#3572A5',
  Go: '#00ADD8', Java: '#b07219', 'C#': '#178600', Ruby: '#701516',
  PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Rust: '#dea584',
  'C++': '#f34b7d', CSS: '#563d7c', HTML: '#e34c26', Shell: '#89e051',
};

const mapRepo = (r) => ({
  id: String(r.id),
  name: r.name,
  fullName: r.full_name,
  description: r.description || '',
  owner: r.owner?.login || '',
  visibility: r.private ? 'Private' : 'Public',
  language: r.language || 'Unknown',
  langColor: LANG_COLORS[r.language] || '#cbd5e1',
  stars: r.stars_count || 0,
  forks: r.forks_count || 0,
  openIssuesCount: r.open_issues_count || 0,
  openPRsCount: r.open_pr_counter || 0,
  lastUpdated: r.updated_at,
  defaultBranch: r.default_branch || 'main',
  storageUsed: r.size ? `${(r.size / 1024).toFixed(1)} MB` : '0 MB',
  htmlUrl: r.html_url,
  cloneUrl: r.clone_url,
  topics: r.topics || [],
});

const mapCommit = (c, repoName, owner) => ({
  id: c.sha,
  hash: c.sha,
  shortHash: c.sha.substring(0, 7),
  message: c.commit?.message?.split('\n')[0] || '',
  fullMessage: c.commit?.message || '',
  author: c.commit?.author?.name || c.author?.login || 'Unknown',
  authorUsername: c.author?.login || '',
  authorAvatar: c.author?.avatar_url || '',
  repository: repoName,
  owner,
  branch: 'main',
  dateTime: c.commit?.author?.date || c.created,
  url: c.html_url,
});

const mapIssue = (i, repoName) => ({
  id: `#${i.number}`,
  number: i.number,
  title: i.title,
  description: i.body || '',
  status: i.state === 'open' ? 'Open' : 'Closed',
  priority: (i.labels?.find(l => ['high','medium','low','critical'].includes(l.name?.toLowerCase()))?.name) || 'Medium',
  repository: repoName,
  author: i.user?.login || '',
  authorAvatar: i.user?.avatar_url || '',
  assignees: (i.assignees || []).map(a => a.login),
  labels: (i.labels || []).map(l => l.name),
  comments: i.comments || 0,
  createdAt: i.created_at,
  updatedAt: i.updated_at,
  closedAt: i.closed_at,
  url: i.html_url,
});

const mapPR = (p, repoName) => ({
  id: `#${p.number}`,
  number: p.number,
  title: p.title,
  description: p.body || '',
  status: p.state === 'open' ? 'Open' : p.merged ? 'Merged' : 'Closed',
  repository: repoName,
  author: p.user?.login || '',
  authorAvatar: p.user?.avatar_url || '',
  fromBranch: p.head?.label || p.head?.ref || '',
  toBranch: p.base?.label || p.base?.ref || '',
  comments: p.comments || 0,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
  mergedAt: p.merged_at,
  url: p.html_url,
});

const mapBranch = (b, repoName) => ({
  id: `${repoName}/${b.name}`,
  name: b.name,
  repository: repoName,
  protected: b.protected || false,
  latestCommitHash: b.commit?.id?.substring(0, 7) || '',
  latestCommitMsg: b.commit?.message?.split('\n')[0] || '',
  latestCommitDate: b.commit?.timestamp || b.commit?.created || '',
  url: b.commit?.url || '',
});

const mapUser = (u) => ({
  id: String(u.id),
  name: u.full_name || u.login,
  username: u.login,
  email: u.email || '',
  avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.login)}&background=3b82f6&color=fff`,
  role: u.is_admin ? 'Administrator' : 'Developer',
  status: 'Active',
  department: 'Engineering',
  website: u.website || '',
  location: u.location || '',
  bio: u.description || '',
  followersCount: u.followers_count || 0,
  followingCount: u.following_count || 0,
});

// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORY SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const repositoryService = {
  getAll: async () => {
    const response = await api.get('/gitea/repos/search', { params: { limit: 50, token: undefined } });
    const repos = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return repos.map(mapRepo);
  },
  getByFullName: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}`);
    return mapRepo(response.data);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMIT SERVICE  (fetches across all repos)
// ─────────────────────────────────────────────────────────────────────────────
export const commitService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/commits`, { params: { limit: 50 } });
    return (Array.isArray(response.data) ? response.data : []).map(c => mapCommit(c, repo, owner));
  },
  getAll: async () => {
    // Fetch repos first, then commits per repo (limited to avoid rate limits)
    const repoRes = await api.get('/gitea/repos/search', { params: { limit: 20 } });
    const repos = Array.isArray(repoRes.data) ? repoRes.data : repoRes.data?.data || [];
    const results = await Promise.allSettled(
      repos.slice(0, 10).map(r =>
        api.get(`/gitea/repos/${r.owner?.login}/${r.name}/commits`, { params: { limit: 20 } })
           .then(res => (Array.isArray(res.data) ? res.data : []).map(c => mapCommit(c, r.name, r.owner?.login)))
      )
    );
    return results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const issueService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/issues`, { params: { type: 'issues', limit: 50, state: 'open' } });
    return (Array.isArray(response.data) ? response.data : []).map(i => mapIssue(i, repo));
  },
  getAll: async () => {
    const repoRes = await api.get('/gitea/repos/search', { params: { limit: 20 } });
    const repos = Array.isArray(repoRes.data) ? repoRes.data : repoRes.data?.data || [];
    const results = await Promise.allSettled(
      repos.slice(0, 10).map(r =>
        api.get(`/gitea/repos/${r.owner?.login}/${r.name}/issues`, { params: { type: 'issues', limit: 20, state: 'open' } })
           .then(res => (Array.isArray(res.data) ? res.data : []).map(i => mapIssue(i, r.name)))
      )
    );
    return results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PULL REQUEST SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const prService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/pulls`, { params: { limit: 50, state: 'open' } });
    return (Array.isArray(response.data) ? response.data : []).map(p => mapPR(p, repo));
  },
  getAll: async () => {
    const repoRes = await api.get('/gitea/repos/search', { params: { limit: 20 } });
    const repos = Array.isArray(repoRes.data) ? repoRes.data : repoRes.data?.data || [];
    const results = await Promise.allSettled(
      repos.slice(0, 10).map(r =>
        api.get(`/gitea/repos/${r.owner?.login}/${r.name}/pulls`, { params: { limit: 20, state: 'open' } })
           .then(res => (Array.isArray(res.data) ? res.data : []).map(p => mapPR(p, r.name)))
      )
    );
    return results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BRANCH SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const branchService = {
  getByRepo: async (owner, repo) => {
    const response = await api.get(`/gitea/repos/${owner}/${repo}/branches`, { params: { limit: 50 } });
    return (Array.isArray(response.data) ? response.data : []).map(b => mapBranch(b, repo));
  },
  getAll: async () => {
    const repoRes = await api.get('/gitea/repos/search', { params: { limit: 20 } });
    const repos = Array.isArray(repoRes.data) ? repoRes.data : repoRes.data?.data || [];
    const results = await Promise.allSettled(
      repos.slice(0, 10).map(r =>
        api.get(`/gitea/repos/${r.owner?.login}/${r.name}/branches`, { params: { limit: 20 } })
           .then(res => (Array.isArray(res.data) ? res.data : []).map(b => mapBranch(b, r.name)))
      )
    );
    return results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEVELOPER / USER SERVICE  (from Gitea)
// ─────────────────────────────────────────────────────────────────────────────
export const developerService = {
  getAll: async () => {
    const response = await api.get('/gitea/admin/users', { params: { limit: 50 } });
    return (Array.isArray(response.data) ? response.data : []).map(mapUser);
  },
  getByUsername: async (username) => {
    const response = await api.get(`/gitea/users/${username}`);
    return mapUser(response.data);
  },
  getRepos: async (username) => {
    const response = await api.get(`/gitea/users/${username}/repos`, { params: { limit: 50 } });
    return (Array.isArray(response.data) ? response.data : []).map(mapRepo);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE  (Custom SQLite backend)
// ─────────────────────────────────────────────────────────────────────────────
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
  },
};

export default api;
