import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import competitorService from '../services/competitorService';

export function useCompetitors() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['competitors'],
    queryFn:  () => competitorService.getAll(),
  });

  return {
    competitors: data?.data ?? [],
    isLoading,
    isError,
    error,
  };
}

export function useCompetitor(id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['competitor', id],
    queryFn:  () => competitorService.getById(id),
    enabled:  !!id,
  });

  return {
    competitor: data?.data ?? null,
    isLoading,
    isError,
    error,
  };
}

export function useCreateCompetitor() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => competitorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      toast.success('Competitor added successfully.');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to add competitor.');
    },
  });

  return { createCompetitor: mutateAsync, isCreating: isPending };
}

export function useUpdateCompetitor() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }) => competitorService.update(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      queryClient.invalidateQueries({ queryKey: ['competitor', id] });
      toast.success('Competitor updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to update competitor.');
    },
  });

  return { updateCompetitor: mutateAsync, isUpdating: isPending };
}

export function useDeleteCompetitor() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id) => competitorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      toast.success('Competitor removed.');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to delete competitor.');
    },
  });

  return { deleteCompetitor: mutateAsync, isDeleting: isPending };
}
