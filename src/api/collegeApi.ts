import apiClient from "./client";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface College {
  _id: string;
  name: string;
  code: string;
  universityId: {
    _id: string;
    name: string;
  };
  city?: string;
}

export interface CollegeInsert {
  name: string;
  code: string;
  universityId: string;
  city?: string;
}

export const collegeApi = {
  
  getAll: async (universityId?: string): Promise<College[]> => {
    const res = await apiClient.get<ApiResponse<College[]>>(
      universityId ? `/colleges?universityId=${universityId}` : "/colleges"
    );
    return res.data.data;
  },

  create: async (data: CollegeInsert): Promise<College> => {
    const res = await apiClient.post<ApiResponse<College>>(
      "/colleges",
      data
    );
    return res.data.data;
  },

  
  update: async (
    id: string,
    data: CollegeInsert
  ): Promise<College> => {
    const res = await apiClient.put<ApiResponse<College>>(
      `/colleges/${id}`,
      data
    );
    return res.data.data;
  },

 
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/colleges/${id}`);
  },
};
