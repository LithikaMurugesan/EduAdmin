import apiClient from './client';
import { Course, CourseInsert, CourseUpdate } from '@/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const coursesApi = {
    getAll: async (): Promise<Course[]> => {
        const response = await apiClient.get<ApiResponse<Course[]>>('/courses');
        return response.data.data;
    },

    getAllIncludingDeleted: async (): Promise<Course[]> => {
        const response = await apiClient.get<ApiResponse<Course[]>>('/courses/all');
        return response.data.data;
    },

    getById: async (id: string): Promise<Course> => {
        const response = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
        return response.data.data;
    },

    create: async (course: CourseInsert): Promise<Course> => {
        const response = await apiClient.post<ApiResponse<Course>>('/courses', course);
        return response.data.data;
    },

    update: async (id: string, updates: CourseUpdate): Promise<Course> => {
        const response = await apiClient.put<ApiResponse<Course>>(`/courses/${id}`, updates);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/courses/${id}`);
    },

    restore: async (id: string): Promise<Course> => {
        const response = await apiClient.put<ApiResponse<Course>>(`/courses/${id}/restore`);
        return response.data.data;
    },
};
