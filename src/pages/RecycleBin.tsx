import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useDeletedStudents, useRestoreStudent } from '@/hooks/useRecycleBin';

const RecycleBin = () => {
  const { data: students = [], isLoading } = useDeletedStudents();
  const restoreStudent = useRestoreStudent();

  if (isLoading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Recycle Bin</h1>

        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Deleted On</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.length > 0 ? (
                students.map((s: any) => (
                  <TableRow key={s._id}>
                    <TableCell>{s.studentId}</TableCell>
                    <TableCell>{s.fullName}</TableCell>
                    <TableCell>{s.departmentId?.name || '-'}</TableCell>
                    <TableCell>{s.departmentId?.universityId?.name || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(s.updatedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          restoreStudent.mutate(s._id);
                          toast.success('Student restored');
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No deleted students
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecycleBin;
