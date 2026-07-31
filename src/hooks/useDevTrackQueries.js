import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  repositoryService, 
  commitService, 
  attendanceService, 
  developerService,
  authService
} from '../services/api';

// Auth Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false, // Don't retry if not logged in
  });
};

// Gitea Repositories
export const useRepositories = () => {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryService.getAll,
  });
};

// Gitea Commits (by repo)
export const useCommits = (owner, repo) => {
  return useQuery({
    queryKey: ['commits', owner, repo],
    queryFn: () => commitService.getByRepo(owner, repo),
    enabled: !!owner && !!repo,
  });
};

// DevTrack Custom Backend
export const useAttendanceLogs = () => {
  return useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.getLogs,
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useDevelopers = () => {
  return useQuery({
    queryKey: ['developers'],
    queryFn: developerService.getAll,
  });
};
