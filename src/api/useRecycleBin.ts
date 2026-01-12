import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recycleBinApi } from '@/api/recycleBin';

export function useDeletedStudents() {
  return useQuery({
    queryKey: ['deleted-students'],
    queryFn: recycleBinApi.getDeletedStudents,
  });
}

export function useRestoreStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recycleBinApi.restoreStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-students'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
