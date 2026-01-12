import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';

export interface College {
  _id: string;
  name: string;
  code: string;
  universityId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

/* =========================
   GET COLLEGES
========================= */
export const useColleges = (universityId?: string) => {
  return useQuery<College[]>({
    queryKey: ['colleges', universityId],
    queryFn: async () => {
      const res = await apiClient.get('/colleges', {
        params: universityId ? { universityId } : {},
      });
      return res.data.data;
    },
  });
};

/* =========================
   ADD COLLEGE
========================= */
export const useAddCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      code: string;
      universityId: string;
    }) => {
      const res = await apiClient.post('/colleges', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
};

/* =========================
   DELETE COLLEGE
========================= */
export const useDeleteCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/colleges/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
};

/* =========================
   UPDATE COLLEGE
========================= */
export const useUpdateCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        name: string;
        code: string;
        universityId: string;
      };
    }) => {
      const res = await apiClient.put(`/colleges/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
};

