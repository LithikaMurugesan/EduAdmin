
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { collegeApi, College } from '@/api/collegeApi';
import { universitiesApi } from '@/api/universityApi';
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
import { Plus, Pencil, Trash2, MoreHorizontal, Search } from 'lucide-react';
import { toast } from 'sonner';

interface University {
  _id: string;
  name: string;
}

export default function CollegePage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    universityId: '',
    city: '',
  });

  
  useEffect(() => {
    universitiesApi.getAll().then(setUniversities);
  }, []);

  
  const loadColleges = () => {
    collegeApi.getAll().then(setColleges);
  };

  useEffect(() => {
    loadColleges();
  }, []);


  const resetForm = () => {
    setFormData({ name: '', code: '', universityId: '', city: '' });
    setEditingCollege(null);
  };


const handleSubmit = async () => {
  if (!formData.name || !formData.code || !formData.universityId) {
    toast.error('Please fill all required fields');
    return;
  }

  try {
    const payload = {
      name: formData.name,
      code: formData.code,
      universityId: formData.universityId, 
      city: formData.city || undefined,
    };

    if (editingCollege) {
      await collegeApi.update(editingCollege._id, payload);
      toast.success('College updated');
    } else {
      await collegeApi.create(payload);
      toast.success('College added');
    }

    resetForm();
    setIsAddOpen(false);
    loadColleges();
  } catch (error: any) {
    console.error(error?.response?.data || error);
    toast.error(error?.response?.data?.message || 'Operation failed');
  }
};


  
  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      code: college.code,
      universityId: college.universityId?._id || '',
      city: college.city || '',
    });
    setIsAddOpen(true);
  };

  
  const handleDelete = async (college: College) => {
    if (!confirm('Delete this college?')) return;

    try {
      await collegeApi.delete(college._id);
      toast.success('College deleted');
      loadColleges();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filteredColleges = colleges.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.city?.toLowerCase().includes(term) ?? false)
    );
  });


  return (
    <DashboardLayout title="Colleges">
      <div className="space-y-6">


        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Colleges</h1>
            <p className="text-muted-foreground">
              Manage all colleges in the system
            </p>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Add College
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCollege ? 'Edit College' : 'Add New College'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Select
                  value={formData.universityId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, universityId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="College Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <Input
                  placeholder="College Code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />

                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingCollege ? 'Update' : 'Add'} College
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>


        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

      
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College</TableHead>
                <TableHead>University</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredColleges.length ? (
                filteredColleges.map((college) => (
                  <TableRow key={college._id}>
                    <TableCell>{college.name}</TableCell>
                    <TableCell>{college.universityId?.name || '-'}</TableCell>
                    <TableCell>{college.city || '-'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(college)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(college)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No colleges found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

