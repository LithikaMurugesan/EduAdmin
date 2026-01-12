import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUniversities } from '@/hooks/useUniversities';
import { useColleges } from '@/hooks/useColleges';
import {
  useDepartments,
  useAddDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '@/hooks/useDepartments';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Departments = () => {
  const { data: universities = [] } = useUniversities();
  const { data: departments = [] } = useDepartments();

  const [selectedUniversity, setSelectedUniversity] = useState('');
  const { data: colleges = [] } = useColleges(selectedUniversity);

  const addDepartment = useAddDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [isOpen, setIsOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);

  const [formData, setFormData] = useState({
    universityId: '',
    collegeId: '',
    name: '',
    code: '',
    description: '',
    headOfDepartment: '',
  });

  
  const resetForm = () => {
    setFormData({
      universityId: '',
      collegeId: '',
      name: '',
      code: '',
      description: '',
      headOfDepartment: '',
    });
    setEditingDepartment(null);
    setSelectedUniversity('');
  };

  useEffect(() => {
    if (!formData.universityId) {
      setFormData((p) => ({ ...p, collegeId: '' }));
    }
  }, [formData.universityId]);

  const handleSubmit = async () => {
    const { universityId, collegeId, name, code } = formData;

    if (!universityId || !collegeId || !name || !code) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingDepartment?._id) {
        await updateDepartment.mutateAsync({
          id: editingDepartment._id,
          updates: formData,
        });
        toast.success('Department updated');
      } else {
        await addDepartment.mutateAsync(formData);
        toast.success('Department created');
      }

      resetForm();
      setIsOpen(false);
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (dept: any) => {
    setEditingDepartment(dept);
    setFormData({
      universityId: dept.universityId?._id || '',
      collegeId: dept.collegeId?._id || '',
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      headOfDepartment: dept.headOfDepartment || '',
    });
    setSelectedUniversity(dept.universityId?._id || '');
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this department?')) return;
    deleteDepartment.mutate(id, {
      onSuccess: () => toast.success('Department deleted'),
      onError: () => toast.error('Delete failed'),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">


        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDepartment ? 'Edit Department' : 'Add Department'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                
                <div>
                  <Label>University *</Label>
                  <Select
                    value={formData.universityId}
                    onValueChange={(v) => {
                      setFormData((p) => ({ ...p, universityId: v, collegeId: '' }));
                      setSelectedUniversity(v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((u: any) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

       
                <div>
                  <Label>College *</Label>
                  <Select
                    value={formData.collegeId}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, collegeId: v }))
                    }
                    disabled={!selectedUniversity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((c: any) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Department Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />

                <Input
                  placeholder="Code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, code: e.target.value }))
                  }
                />

                <Input
                  placeholder="Head of Department"
                  value={formData.headOfDepartment}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, headOfDepartment: e.target.value }))
                  }
                />

                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit}>
                  {editingDepartment ? 'Update' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        
        <div className="border rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>University</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {departments.length ? (
                departments.map((d: any) => (
                  <TableRow key={d._id}>
                    <TableCell>{d.name}</TableCell>
                    <TableCell><Badge>{d.code}</Badge></TableCell>
                    <TableCell>{d.universityId?.name}</TableCell>
                    <TableCell>{d.collegeId?.name}</TableCell>
                    <TableCell>
                      {format(new Date(d.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(d)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(d._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No departments found
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

export default Departments;
