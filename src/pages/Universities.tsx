import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  useUniversities,
  useAddUniversity,
  useUpdateUniversity,
  useDeleteUniversity,
  University,
} from '@/hooks/useUniversities';
import { useDepartments } from '@/hooks/useDepartments';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Universities = () => {
  const { data: universities = [], isLoading } = useUniversities();
  const { data: departments = [] } = useDepartments();

  const addUniversity = useAddUniversity();
  const updateUniversity = useUpdateUniversity();
  const deleteUniversity = useDeleteUniversity();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] =
    useState<University | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    state: '',
    country: '',
    establishedYear: new Date().getFullYear(),
    accreditation_status: 'Pending',
    university_type: 'Public',
    description: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      city: '',
      state: '',
      country: '',
      establishedYear: new Date().getFullYear(),
      accreditation_status: 'Pending',
      university_type: 'Public',
      description: '',
    });
    setEditingUniversity(null);
  };

  const getDepartmentCount = (universityId: string) =>
    departments.filter(d =>
      typeof d.universityId === 'string'
        ? d.universityId === universityId
        : d.universityId?._id === universityId
    ).length;

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.code ||
      !formData.city ||
      !formData.state ||
      !formData.country
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingUniversity) {
        await updateUniversity.mutateAsync({
          id: editingUniversity._id,
          updates: formData,
        });
        toast.success('University updated');
      } else {
        await addUniversity.mutateAsync(formData);
        toast.success('University added');
      }

      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (u: University) => {
    setEditingUniversity(u);
    setFormData({
      name: u.name,
      code: u.code,
      city: u.city,
      state: u.state,
      country: u.country,
      establishedYear: u.establishedYear,
      accreditation_status: u.accreditation_status,
      university_type: u.university_type,
      description: u.description || '',
    });
    setOpen(true);
  };

  const handleDelete = async (u: University) => {
    await deleteUniversity.mutateAsync(u._id);
    toast.success('University deleted');
  };

  const filteredUniversities = universities.filter(u =>
    [u.name, u.code, u.city, u.state, u.country]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <div className="space-y-6">
      
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Universities</h1>
            <p className="text-muted-foreground">Manage universities</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add University
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingUniversity ? 'Edit University' : 'Add University'}
                </DialogTitle>
                <DialogDescription>University details</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Code *</Label>
                  <Input
                    placeholder="e.g. MGRU"
                    value={formData.code}
                    onChange={e =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>City *</Label>
                  <Input
                    value={formData.city}
                    onChange={e =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>State *</Label>
                  <Input
                    value={formData.state}
                    onChange={e =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Country *</Label>
                  <Input
                    value={formData.country}
                    onChange={e =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Established Year</Label>
                  <Input
                    type="number"
                    value={formData.establishedYear}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        establishedYear: +e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingUniversity ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search university..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUniversities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No universities found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUniversities.map(u => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.code}</TableCell>
                    <TableCell>{u.city}</TableCell>
                    <TableCell>{u.state}</TableCell>
                    <TableCell>{u.country}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getDepartmentCount(u._id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(u)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(u)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/departments?university=${u._id}`}>
                              <Building2 className="h-4 w-4 mr-2" />
                              View Departments
                            </Link>
                          </DropdownMenuItem>
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

export default Universities;
