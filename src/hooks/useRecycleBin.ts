import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';

export function useDeletedStudents() {
  return useQuery({
    queryKey: ['deleted-students'],
    queryFn: async () => {
      const res = await apiClient.get('/students/deleted');
      return res.data.data;
    },
  });
}

export function useRestoreStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(`/students/${id}/restore`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-students'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
