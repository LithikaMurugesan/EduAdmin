import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/api/enrollments';
import { Enrollment, EnrollmentInsert, EnrollmentUpdate } from '@/types';
import { toast } from 'sonner';

export type { Enrollment, EnrollmentInsert, EnrollmentUpdate };

export function useEnrollments() {
    return useQuery({
        queryKey: ['enrollments'],
        queryFn: () => enrollmentsApi.getAll(),
    });
}

export function useAllEnrollments() {
    return useQuery({
        queryKey: ['enrollments', 'all'],
        queryFn: () => enrollmentsApi.getAllIncludingDeleted(),
    });
}

export function useAddEnrollment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (enrollment: EnrollmentInsert) => enrollmentsApi.create(enrollment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            toast.success('Enrollment added successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to add enrollment: ' + (error.response?.data?.message || error.message));
        },
    });
}

export function useUpdateEnrollment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: EnrollmentUpdate }) =>
            enrollmentsApi.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            toast.success('Enrollment updated successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to update enrollment: ' + (error.response?.data?.message || error.message));
        },
    });
}

export function useDeleteEnrollment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => enrollmentsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            toast.success('Enrollment moved to recycle bin');
        },
        onError: (error: any) => {
            toast.error('Failed to delete enrollment: ' + (error.response?.data?.message || error.message));
        },
    });
}

export function useRestoreEnrollment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => enrollmentsApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            toast.success('Enrollment restored successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to restore enrollment: ' + (error.response?.data?.message || error.message));
        },
    });
}
