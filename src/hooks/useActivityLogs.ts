import { useQuery } from '@tanstack/react-query';
import { activityLogsApi } from '@/api/activityLogs';

export function useActivityLogs() {
  return useQuery({
    queryKey: ['activityLogs'],
    queryFn: () => activityLogsApi.getAll(),
  });
}
