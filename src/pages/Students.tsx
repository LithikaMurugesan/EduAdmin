
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import {
  useStudents,
  useAddStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '@/hooks/useStudents';
import { useUniversities } from '@/hooks/useUniversities';
import { useDepartments } from '@/hooks/useDepartments';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const StudentsPage = () => {
  const { data: students = [] } = useStudents();
  const { data: universities = [] } = useUniversities();
  const { data: departments = [] } = useDepartments();

  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [isOpen, setIsOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    universityId: '',
    departmentId: '',
    email: '',
    dateOfBirth: '',
  });

  const filteredDepartments = formData.universityId
    ? departments.filter(d => {
        const uniId =
          typeof d.universityId === 'string'
            ? d.universityId
            : d.universityId?._id;

        return uniId === formData.universityId;
      })
    : [];

  
  const resetForm = () => {
    setFormData({
      studentId: '',
      fullName: '',
      universityId: '',
      departmentId: '',
      email: '',
      dateOfBirth: '',
    });
    setEditingStudent(null);
  };


 const handleEdit = (student: any) => {
  setEditingStudent(student);

  setFormData({
    studentId: student.studentId,
    fullName: student.fullName,
    universityId: student.departmentId?.universityId?._id || '',
    departmentId: student.departmentId?._id || '',
    email: student.email || '',
    dateOfBirth: student.dateOfBirth?.slice(0, 10) || '',
  });

  setIsOpen(true);
};



  const handleDelete = async (id: string) => {
    await deleteStudent.mutateAsync(id);
  };

  const handleSubmit = async () => {
    if (
      !formData.studentId ||
      !formData.fullName ||
      !formData.departmentId
    ) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      studentId: formData.studentId,
      fullName: formData.fullName,
     departmentId: formData.departmentId,

      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
    };

    try {
      if (editingStudent) {
        await updateStudent.mutateAsync({
          id: editingStudent._id,
          updates: payload,
        });
      } else {
        await addStudent.mutateAsync(payload);
      }

      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              Manage student records
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Edit Student' : 'Add Student'}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label>Student ID *</Label>
                  <Input
                    placeholder="STU001"
                    value={formData.studentId}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        studentId: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>University *</Label>
                  <Select
                    value={formData.universityId}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        universityId: value,
                        departmentId: '',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map(u => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Department *</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        departmentId: value,
                      })
                    }
                    disabled={!formData.universityId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments.map(d => (
                        <SelectItem key={d._id} value={d._id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="student@email.com"
                    value={formData.email}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingStudent ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

         <TableBody>
  {students.map(student => (
    <TableRow key={student._id}>
      <TableCell>{student.studentId}</TableCell>
      <TableCell>{student.fullName}</TableCell>

      <TableCell>{student.departmentId?.name || '-'}</TableCell>
      <TableCell>{student.departmentId?.universityId?.name || '-'}</TableCell>

      <TableCell>{student.email || '-'}</TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(student)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(student._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
