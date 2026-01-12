import apiClient from './client';
import { Faculty, FacultyInsert, FacultyUpdate } from '@/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const facultyApi = {
    getAll: async (): Promise<Faculty[]> => {
        const response = await apiClient.get<ApiResponse<Faculty[]>>('/faculty');
        return response.data.data;
    },

    getAllIncludingDeleted: async (): Promise<Faculty[]> => {
        const response = await apiClient.get<ApiResponse<Faculty[]>>('/faculty/all');
        return response.data.data;
    },

    getById: async (id: string): Promise<Faculty> => {
        const response = await apiClient.get<ApiResponse<Faculty>>(`/faculty/${id}`);
        return response.data.data;
    },

    create: async (faculty: FacultyInsert): Promise<Faculty> => {
        const response = await apiClient.post<ApiResponse<Faculty>>('/faculty', faculty);
        return response.data.data;
    },

    update: async (id: string, updates: FacultyUpdate): Promise<Faculty> => {
        const response = await apiClient.put<ApiResponse<Faculty>>(`/faculty/${id}`, updates);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/faculty/${id}`);
    },

    restore: async (id: string): Promise<Faculty> => {
        const response = await apiClient.put<ApiResponse<Faculty>>(`/faculty/${id}/restore`);
        return response.data.data;
    },
};
