import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import alertService from '../services/alertService';

export function useAlerts(unreadOnly = false) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey:        ['alerts', unreadOnly],
    queryFn:         () => alertService.getAll(unreadOnly),
    refetchInterval: 60 * 1000, // 60 seconds
  });

  return {
    alerts: data?.data ?? [],
    isLoading,
    isError,
    error,
  };
}

export function useUnreadCount() {
  const { data, isLoading } = useQuery({
    queryKey:        ['unreadCount'],
    queryFn:         () => alertService.getUnreadCount(),
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return {
    unreadCount: data?.data ?? 0,
    isLoading,
  };
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id) => alertService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  return { markAsRead: mutateAsync, isMarking: isPending };
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => alertService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  return { markAllAsRead: mutateAsync, isMarkingAll: isPending };
}
