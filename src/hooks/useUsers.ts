import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, User } from '@/api/users';
import { toast } from 'sonner';

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => usersApi.getAll(),
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: 'admin' | 'superadmin' }) =>
            usersApi.updateRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User role updated successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to update role: ' + (error.response?.data?.message || error.message));
        },
    });
}
