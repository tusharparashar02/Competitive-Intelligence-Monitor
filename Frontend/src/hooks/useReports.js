import { useQuery } from '@tanstack/react-query';
import reportService from '../services/reportService';

export function useReports() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reports'],
    queryFn:  () => reportService.getAll(),
  });

  return {
    reports: data?.data ?? [],
    isLoading,
    isError,
    error,
  };
}

export function useReport(id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['report', id],
    queryFn:  () => reportService.getById(id),
    enabled:  !!id,
  });

  return {
    report: data?.data ?? null,
    isLoading,
    isError,
    error,
  };
}
