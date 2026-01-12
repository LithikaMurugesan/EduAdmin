import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, ShieldCheck, UserCog } from 'lucide-react';
import { useUsers, useUpdateUserRole } from '@/hooks/useUsers';

export default function ManageAdmins() {
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: users = [], isLoading } = useUsers();
  const updateRoleMutation = useUpdateUserRole();

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'superadmin') => {
    setUpdating(userId);

    try {
      await updateRoleMutation.mutateAsync({ id: userId, role: newRole });
      toast({
        title: 'Success',
        description: `Role updated to ${newRole}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Admins</h1>
          <p className="text-muted-foreground">Assign and manage admin roles</p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              User Roles
            </CardTitle>
            <CardDescription>
              Assign roles to users. Superadmins can manage everything, Admins have limited access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No users found. Users will appear here after they sign up.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Assign Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.fullName || 'No name'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge
                            variant={user.role === 'superadmin' ? 'default' : 'secondary'}
                            className="flex items-center gap-1 w-fit"
                          >
                            {user.role === 'superadmin' ? (
                              <ShieldCheck className="h-3 w-3" />
                            ) : (
                              <Shield className="h-3 w-3" />
                            )}
                            {user.role}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No role</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role || ''}
                          onValueChange={(value) => handleRoleChange(user._id, value as 'admin' | 'superadmin')}
                          disabled={updating === user._id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">Superadmin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
