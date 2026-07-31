import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  repositoryService,
  commitService,
  issueService,
  prService,
  branchService,
  developerService,
  attendanceService,
  authService,
} from '../services/api';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export const useCurrentUser = () =>
  useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORIES
// ─────────────────────────────────────────────────────────────────────────────
export const useRepositories = () =>
  useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryService.getAll,
    staleTime: 2 * 60 * 1000,
  });

export const useRepoDetail = (owner, name) =>
  useQuery({
    queryKey: ['repository', owner, name],
    queryFn: () => repositoryService.getByFullName(owner, name),
    enabled: !!owner && !!name,
  });

// ─────────────────────────────────────────────────────────────────────────────
// COMMITS  — all repos aggregated
// ─────────────────────────────────────────────────────────────────────────────
export const useAllCommits = () =>
  useQuery({
    queryKey: ['allCommits'],
    queryFn: commitService.getAll,
    staleTime: 60 * 1000,
  });

export const useRepoCommits = (owner, repo) =>
  useQuery({
    queryKey: ['commits', owner, repo],
    queryFn: () => commitService.getByRepo(owner, repo),
    enabled: !!owner && !!repo,
  });

// ─────────────────────────────────────────────────────────────────────────────
// ISSUES  — all repos aggregated
// ─────────────────────────────────────────────────────────────────────────────
export const useAllIssues = () =>
  useQuery({
    queryKey: ['allIssues'],
    queryFn: issueService.getAll,
    staleTime: 60 * 1000,
  });

export const useRepoIssues = (owner, repo) =>
  useQuery({
    queryKey: ['issues', owner, repo],
    queryFn: () => issueService.getByRepo(owner, repo),
    enabled: !!owner && !!repo,
  });

// ─────────────────────────────────────────────────────────────────────────────
// PULL REQUESTS  — all repos aggregated
// ─────────────────────────────────────────────────────────────────────────────
export const useAllPullRequests = () =>
  useQuery({
    queryKey: ['allPullRequests'],
    queryFn: prService.getAll,
    staleTime: 60 * 1000,
  });

export const useRepoPullRequests = (owner, repo) =>
  useQuery({
    queryKey: ['prs', owner, repo],
    queryFn: () => prService.getByRepo(owner, repo),
    enabled: !!owner && !!repo,
  });

// ─────────────────────────────────────────────────────────────────────────────
// BRANCHES  — all repos aggregated
// ─────────────────────────────────────────────────────────────────────────────
export const useAllBranches = () =>
  useQuery({
    queryKey: ['allBranches'],
    queryFn: branchService.getAll,
    staleTime: 2 * 60 * 1000,
  });

export const useRepoBranches = (owner, repo) =>
  useQuery({
    queryKey: ['branches', owner, repo],
    queryFn: () => branchService.getByRepo(owner, repo),
    enabled: !!owner && !!repo,
  });

// ─────────────────────────────────────────────────────────────────────────────
// DEVELOPERS / USERS  (from Gitea admin API)
// ─────────────────────────────────────────────────────────────────────────────
export const useDevelopers = () =>
  useQuery({
    queryKey: ['developers'],
    queryFn: developerService.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useDevProfile = (username) =>
  useQuery({
    queryKey: ['developer', username],
    queryFn: () => developerService.getByUsername(username),
    enabled: !!username,
  });

export const useDevRepos = (username) =>
  useQuery({
    queryKey: ['developerRepos', username],
    queryFn: () => developerService.getRepos(username),
    enabled: !!username,
  });

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE  (Custom SQLite backend)
// ─────────────────────────────────────────────────────────────────────────────
export const useAttendanceLogs = () =>
  useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.getLogs,
  });

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance'] }),
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance'] }),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// STUB HOOKS (for pages not yet backed by a real endpoint — return empty gracefully)
// ─────────────────────────────────────────────────────────────────────────────
export const useOrgInfo = () =>
  useQuery({
    queryKey: ['orgInfo'],
    queryFn: async () => {
      try {
        const response = await import('../services/api').then(m => m.default.get('/gitea/settings/api'));
        return response.data;
      } catch {
        return { name: 'DevTrack', domain: 'local' };
      }
    },
    staleTime: Infinity,
  });

export const useActivityLogs = () =>
  useQuery({ queryKey: ['activityLogs'], queryFn: () => [], staleTime: Infinity });

export const useAuditLogs = () =>
  useQuery({ queryKey: ['auditLogs'], queryFn: () => [], staleTime: Infinity });

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const m = await import('../services/api');
        const response = await m.default.get('/gitea/notifications', { params: { all: true, limit: 30 } });
        return Array.isArray(response.data) ? response.data : [];
      } catch {
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
