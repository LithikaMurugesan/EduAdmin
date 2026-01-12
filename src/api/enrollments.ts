import apiClient from './client';
import { Enrollment, EnrollmentInsert, EnrollmentUpdate } from '@/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const enrollmentsApi = {
    getAll: async (): Promise<Enrollment[]> => {
        const response = await apiClient.get<ApiResponse<Enrollment[]>>('/enrollments');
        return response.data.data;
    },

    getAllIncludingDeleted: async (): Promise<Enrollment[]> => {
        const response = await apiClient.get<ApiResponse<Enrollment[]>>('/enrollments/all');
        return response.data.data;
    },

    getById: async (id: string): Promise<Enrollment> => {
        const response = await apiClient.get<ApiResponse<Enrollment>>(`/enrollments/${id}`);
        return response.data.data;
    },

    create: async (enrollment: EnrollmentInsert): Promise<Enrollment> => {
        const response = await apiClient.post<ApiResponse<Enrollment>>('/enrollments', enrollment);
        return response.data.data;
    },

    update: async (id: string, updates: EnrollmentUpdate): Promise<Enrollment> => {
        const response = await apiClient.put<ApiResponse<Enrollment>>(`/enrollments/${id}`, updates);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/enrollments/${id}`);
    },

    restore: async (id: string): Promise<Enrollment> => {
        const response = await apiClient.put<ApiResponse<Enrollment>>(`/enrollments/${id}/restore`);
        return response.data.data;
    },
};
