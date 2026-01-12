import apiClient from './client';
import { ActivityLog } from '@/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface ActivityLogFilters {
    entityType?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
}

export const activityLogsApi = {
    getAll: async (filters?: ActivityLogFilters): Promise<ActivityLog[]> => {
        const response = await apiClient.get<ApiResponse<ActivityLog[]>>('/activity-logs', {
            params: filters,
        });
        return response.data.data;
    },

    getById: async (id: string): Promise<ActivityLog> => {
        const response = await apiClient.get<ApiResponse<ActivityLog>>(`/activity-logs/${id}`);
        return response.data.data;
    },
};
