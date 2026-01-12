import apiClient from './client';
import { Department, DepartmentInsert, DepartmentUpdate } from '@/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const departmentsApi = {
    getAll: async (): Promise<Department[]> => {
        const response = await apiClient.get<ApiResponse<Department[]>>('/departments');
        return response.data.data;
    },

    getAllIncludingDeleted: async (): Promise<Department[]> => {
        const response = await apiClient.get<ApiResponse<Department[]>>('/departments/all');
        return response.data.data;
    },

    getById: async (id: string): Promise<Department> => {
        const response = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
        return response.data.data;
    },

    create: async (department: DepartmentInsert): Promise<Department> => {
        const response = await apiClient.post<ApiResponse<Department>>('/departments', department);
        return response.data.data;
    },

    update: async (id: string, updates: DepartmentUpdate): Promise<Department> => {
        const response = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, updates);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/departments/${id}`);
    },

    restore: async (id: string): Promise<Department> => {
        const response = await apiClient.put<ApiResponse<Department>>(`/departments/${id}/restore`);
        return response.data.data;
    },
};
