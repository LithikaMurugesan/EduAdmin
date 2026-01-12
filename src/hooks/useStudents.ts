import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/api/students';
import { Student, StudentInsert, StudentUpdate } from '@/types';
import { toast } from 'sonner';

export type { Student, StudentInsert, StudentUpdate };

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      return studentsApi.getAll();
    },
  });
}

export function useAllStudents() {
  return useQuery({
    queryKey: ['students', 'all'],
    queryFn: async () => {
      return studentsApi.getAllIncludingDeleted();
    },
  });
}

export function useAddStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student: StudentInsert) => {
      return studentsApi.create(student);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add student: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: StudentUpdate }) => {
      return studentsApi.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update student: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return studentsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student moved to recycle bin');
    },
    onError: (error: any) => {
      toast.error('Failed to delete student: ' + (error.response?.data?.message || error.message));
    },
  });
}

export function useRestoreStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return studentsApi.restore(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student restored successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to restore student: ' + (error.response?.data?.message || error.message));
    },
  });
}

