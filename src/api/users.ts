import apiClient from './client';

export interface User {
    _id: string;
    email: string;
    fullName: string;
    role: 'admin' | 'superadmin';
    createdAt: string;
    updatedAt?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const usersApi = {
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get<ApiResponse<User[]>>('/users');
        return response.data.data;
    },

    getById: async (id: string): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
        return response.data.data;
    },

    updateRole: async (id: string, role: 'admin' | 'superadmin'): Promise<User> => {
        const response = await apiClient.put<ApiResponse<User>>(`/users/${id}/role`, { role });
        return response.data.data;
    },

    update: async (id: string, updates: Partial<User>): Promise<User> => {
        const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, updates);
        return response.data.data;
    },
};
