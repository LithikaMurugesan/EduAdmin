import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { universitiesApi } from '@/api/universityApi';
import { University, UniversityInsert, UniversityUpdate } from '@/types';
import { toast } from 'sonner';

export type { University, UniversityInsert, UniversityUpdate };

export function useUniversities() {
  return useQuery({
    queryKey: ['universities'],
    queryFn: () => universitiesApi.getAll(),
  });
}

export function useAllUniversities() {
  return useQuery({
    queryKey: ['universities', 'all'],
    queryFn: () => universitiesApi.getAllIncludingDeleted(),
  });
}

export function useAddUniversity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (university: UniversityInsert) => universitiesApi.create(university),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      toast.success('University added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add university: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UniversityUpdate }) =>
      universitiesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      toast.success('University updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update university: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => universitiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      toast.success('University moved to recycle bin');
    },
    onError: (error: any) => {
      toast.error('Failed to delete university: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useRestoreUniversity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => universitiesApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      toast.success('University restored successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to restore university: ' + (error.response?.data?.message || error.message));
    },
  });
}
