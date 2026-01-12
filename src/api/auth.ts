import apiClient, { setAccessToken } from './client';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    fullName: string;
}

export interface AuthResponse {
    success: boolean;
    user: {
        id: string;
        email: string;
        fullName: string;
        role: 'admin' | 'superadmin';
    };
    accessToken: string;
}

export const authApi = {
    signup: async (data: SignupData): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/signup', data);
        if (response.data.accessToken) setAccessToken(response.data.accessToken);
        return response.data;
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.accessToken) setAccessToken(response.data.accessToken);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
        setAccessToken(null);
    },

    refreshToken: async (): Promise<{ accessToken: string }> => {
        const response = await apiClient.post('/auth/refresh');
        if (response.data.accessToken) setAccessToken(response.data.accessToken);
        return response.data;
    },
};
