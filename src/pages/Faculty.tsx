import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  useFaculty,
  useAddFaculty,
  useUpdateFaculty,
  useDeleteFaculty,
  Faculty,
  FacultyInsert,
} from '@/hooks/useFaculty';
import { useDepartments } from '@/hooks/useDepartments';
import { useAuth } from '@/contexts/AuthContext';

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
  DialogDescription,
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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const FacultyPage = () => {
  const [searchParams] = useSearchParams();
  const departmentFilter = searchParams.get('department');
  const { isSuperadmin } = useAuth();

  const { data: faculty = [], isLoading } = useFaculty();
  const { data: departments = [] } = useDepartments();

  const addFaculty = useAddFaculty();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();

  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(
    departmentFilter || 'all'
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  const [formData, setFormData] = useState<Partial<FacultyInsert>>({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    designation: '',
    specialization: '',
    dateOfJoining: '',
  });



  const getDepartmentId = (dept: any) =>
    typeof dept === 'string' ? dept : dept?._id;

  const getDepartmentName = (dept: any) =>
    typeof dept === 'object' ? dept?.name : departments.find(d => d._id === dept)?.name || '—';

 

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch =
      f.fullName.toLowerCase().includes(search.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'all' ||
      getDepartmentId(f.departmentId) === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  
  const resetForm = () => {
    setFormData({
      employeeId: '',
      fullName: '',
      email: '',
      phone: '',
      departmentId:
        selectedDepartment !== 'all' ? selectedDepartment : '',
      designation: '',
      specialization: '',
      dateOfJoining: '',
    });
    setEditingFaculty(null);
  };

  const handleSubmit = async () => {
    if (
      !formData.employeeId ||
      !formData.fullName ||
      !formData.email ||
      !formData.departmentId
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingFaculty) {
        await updateFaculty.mutateAsync({
          id: editingFaculty._id,
          updates: formData,
        });
      } else {
        await addFaculty.mutateAsync(formData as FacultyInsert);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (f: Faculty) => {
    setEditingFaculty(f);
    setFormData({
      employeeId: f.employeeId,
      fullName: f.fullName,
      email: f.email,
      phone: f.phone || '',
      departmentId: getDepartmentId(f.departmentId),
      designation: f.designation || '',
      specialization: f.specialization || '',
      dateOfJoining: f.dateOfJoining?.slice(0, 10) || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (f: Faculty) => {
    await deleteFaculty.mutateAsync(f._id);
  };



  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Faculty</h1>
            <p className="text-muted-foreground">
              Manage faculty members
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
                </DialogTitle>
                <DialogDescription>
                  Faculty details as per schema
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label>Employee ID *</Label>
                  <Input
                  placeholder='e.g. EMP2024CSE01'
                    value={formData.employeeId}
                    onChange={e =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Department *</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={v =>
                      setFormData({ ...formData, departmentId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(d => (
                        <SelectItem key={d._id} value={d._id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label>Full Name *</Label>
                  <Input
                  placeholder="e.g. Dr. Arun Kumar"
                    value={formData.fullName}
                    onChange={e =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                  placeholder="e.g. arun.kumar@college.edu"
                    type="email"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                  placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Designation</Label>
                  <Input
                  placeholder="e.g. Assistant Professor"
                    value={formData.designation}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        designation: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Specialization</Label>
                  <Input
                  placeholder="e.g. Artificial Intelligence, Data Science"
                    value={formData.specialization}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Date of Joining</Label>
                  <Input
                   placeholder="Select joining date"
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        dateOfJoining: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingFaculty ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>


        <div className="flex gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search faculty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => (
                <SelectItem key={d._id} value={d._id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

       
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredFaculty.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <User className="mx-auto mb-2 opacity-40" />
                    No faculty found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFaculty.map(f => (
                  <TableRow key={f._id}>
                    <TableCell>{f.employeeId}</TableCell>
                    <TableCell>{f.fullName}</TableCell>
                    <TableCell>
                      {getDepartmentName(f.departmentId)}
                    </TableCell>
                    <TableCell>{f.email}</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(f)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {isSuperadmin && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(f)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyPage;
