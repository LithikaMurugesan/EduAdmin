import apiClient from './client';
import { Student, StudentInsert, StudentUpdate } from '@/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const studentsApi = {
    getAll: async (): Promise<Student[]> => {
        const response = await apiClient.get<ApiResponse<Student[]>>('/students');
        return response.data.data;
    },

    getAllIncludingDeleted: async (): Promise<Student[]> => {
        const response = await apiClient.get<ApiResponse<Student[]>>('/students/all');
        return response.data.data;
    },

    getById: async (id: string): Promise<Student> => {
        const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
        return response.data.data;
    },

    create: async (student: StudentInsert): Promise<Student> => {
        const response = await apiClient.post<ApiResponse<Student>>('/students', student);
        return response.data.data;
    },

    update: async (id: string, updates: StudentUpdate): Promise<Student> => {
        const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, updates);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/students/${id}`);
    },

    restore: async (id: string): Promise<Student> => {
        const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}/restore`);
        return response.data.data;
    },
};
