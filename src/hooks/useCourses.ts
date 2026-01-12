import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/api/courses';
import { Course, CourseInsert, CourseUpdate } from '@/types';
import { toast } from 'sonner';

export type { Course, CourseInsert, CourseUpdate };

export function useCourses() {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => coursesApi.getAll(),
    });
}

export function useAllCourses() {
    return useQuery({
        queryKey: ['courses', 'all'],
        queryFn: () => coursesApi.getAllIncludingDeleted(),
    });
}

export function useAddCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (course: CourseInsert) => coursesApi.create(course),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course added successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to add course: ' + (error.response?.data?.message || error.message));
        },
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: CourseUpdate }) =>
            coursesApi.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course updated successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to update course: ' + (error.response?.data?.message || error.message));
        },
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => coursesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course moved to recycle bin');
        },
        onError: (error: any) => {
            toast.error('Failed to delete course: ' + (error.response?.data?.message || error.message));
        },
    });
}

export function useRestoreCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => coursesApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course restored successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to restore course: ' + (error.response?.data?.message || error.message));
        },
    });
}
