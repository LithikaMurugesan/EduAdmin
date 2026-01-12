import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyApi } from '@/api/faculty';
import { Faculty, FacultyInsert, FacultyUpdate } from '@/types';
import { toast } from 'sonner';

export type { Faculty, FacultyInsert, FacultyUpdate };

export function useFaculty() {
  return useQuery({
    queryKey: ['faculty'],
    queryFn: async () => {
      return facultyApi.getAll();
    },
  });
}

export function useAllFaculty() {
  return useQuery({
    queryKey: ['faculty', 'all'],
    queryFn: async () => {
      return facultyApi.getAllIncludingDeleted();
    },
  });
}

export function useAddFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faculty: FacultyInsert) => {
      return facultyApi.create(faculty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add faculty: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FacultyUpdate }) => {
      return facultyApi.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update faculty: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return facultyApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty moved to recycle bin');
    },
    onError: (error: any) => {
      toast.error('Failed to delete faculty: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useRestoreFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return facultyApi.restore(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty restored successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to restore faculty: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useLinkFacultyToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facultyId, userId }: { facultyId: string; userId: string }) => {
      
      toast.info('User linking is not available without authentication');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
    },
    onError: (error) => {
      toast.error('Failed to link faculty account: ' + error.message);
    },
  });
}
