import axios from 'axios';
import * as mockData from '../data/mockData';

// Simulated API delay (ms)
const API_DELAY = 100;

// Setup a baseline axios instance (UI only)
const api = axios.create({
  baseURL: 'https://api.devtrack.internal/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Helper to simulate API call latency
const delayResolve = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, API_DELAY);
  });
};

export const orgService = {
  getOrgInfo: () => delayResolve(mockData.orgInfo),
  getAuditLogs: () => delayResolve(mockData.auditLogs),
};

export const repositoryService = {
  getAll: () => delayResolve(mockData.repositories),
  getByName: (name) => delayResolve(mockData.getRepoDetail(name)),
  create: (repo) => delayResolve({ message: "Repository created successfully", repo }),
  delete: (id) => delayResolve({ message: "Repository deleted successfully", id }),
};

export const developerService = {
  getAll: () => delayResolve(mockData.developers),
  getByUsername: (username) => delayResolve(mockData.getDevProfile(username)),
  create: (dev) => delayResolve({ message: "Developer registered successfully", dev }),
  delete: (id) => delayResolve({ message: "Developer removed successfully", id }),
  assignRole: (id, role) => delayResolve({ message: "Role assigned successfully", id, role }),
};

export const commitService = {
  getAll: () => delayResolve(mockData.commits),
  getByRepo: (repoName) => delayResolve(mockData.commits.filter(c => c.repository.toLowerCase() === repoName.toLowerCase())),
};

export const branchService = {
  getAll: () => delayResolve(mockData.branches),
  getByRepo: (repoName) => delayResolve(mockData.branches.filter(b => b.repository.toLowerCase() === repoName.toLowerCase())),
};

export const prService = {
  getAll: () => delayResolve(mockData.pullRequests),
  getByRepo: (repoName) => delayResolve(mockData.pullRequests.filter(p => p.repository.toLowerCase() === repoName.toLowerCase())),
};

export const issueService = {
  getAll: () => delayResolve(mockData.issues),
  getByRepo: (repoName) => delayResolve(mockData.issues.filter(i => i.repository.toLowerCase() === repoName.toLowerCase())),
};

export const activityService = {
  getTimeline: () => delayResolve(mockData.activityLogs),
};

export const notificationService = {
  getAll: () => delayResolve(mockData.notifications),
  markAllAsRead: () => delayResolve({ success: true }),
};

export const attendanceService = {
  getLogs: () => delayResolve(mockData.attendanceLogs),
  checkIn: (userId, time) => delayResolve({ success: true, message: "Clocked in successfully", time }),
  checkOut: (userId, time) => delayResolve({ success: true, message: "Clocked out successfully", time })
};

export default api;
