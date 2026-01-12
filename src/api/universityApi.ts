import apiClient from './client';
import { University, UniversityInsert, UniversityUpdate } from '@/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const universitiesApi = {
    getAll: async (): Promise<University[]> => {
        const response = await apiClient.get<ApiResponse<University[]>>('/universities');
        return response.data.data;
    },

    getAllIncludingDeleted: async (): Promise<University[]> => {
        const response = await apiClient.get<ApiResponse<University[]>>('/universities/all');
        return response.data.data;
    },

    getById: async (id: string): Promise<University> => {
        const response = await apiClient.get<ApiResponse<University>>(`/universities/${id}`);
        return response.data.data;
    },

    create: async (university: UniversityInsert): Promise<University> => {
        const response = await apiClient.post<ApiResponse<University>>('/universities', university);
        return response.data.data;
    },

    update: async (id: string, updates: UniversityUpdate): Promise<University> => {
        const response = await apiClient.put<ApiResponse<University>>(`/universities/${id}`, updates);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/universities/${id}`);
    },

    restore: async (id: string): Promise<University> => {
        const response = await apiClient.put<ApiResponse<University>>(`/universities/${id}/restore`);
        return response.data.data;
    },
};
