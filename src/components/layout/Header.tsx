
import { Bell, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import apiClient, { setAccessToken } from '@/api/client';
import { useUniversities } from '@/hooks/useUniversities';
import { useDepartments } from '@/hooks/useDepartments';
import { useStudents } from '@/hooks/useStudents';


import { useDataStore } from '@/store/dataStore';
import { useNavigate } from 'react-router-dom';
interface HeaderProps {
  sidebarCollapsed?: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const activityLogs = useDataStore((state) => state.activityLogs);
  const recentLogs = activityLogs.slice(0, 5);

  const { data: universities = [] } = useUniversities();
  const { data: departments = [] } = useDepartments();
  const { data: students = [] } = useStudents();
const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const q = query.toLowerCase();

  
  const results = query
    ? [
        ...universities
          .filter((u) => u.name?.toLowerCase().includes(q))
          .map((u) => ({ type: 'University', id: u._id, label: u.name })),

        ...departments
          .filter((d) => d.name?.toLowerCase().includes(q))
          .map((d) => ({ type: 'Department', id: d._id, label: d.name })),

        ...students
          .filter(
            (s) =>
              s.name?.toLowerCase().includes(q) ||
              s.registerNumber?.toLowerCase().includes(q)
          )
          .map((s) => ({ type: 'Student', id: s._id, label: s.name })),
      ].slice(0, 10)
    : [];

  
  useEffect(() => {
    setOpen(results.length > 0);
  }, [results]);
  
const handleLogout = async () => {
  await apiClient.post('/auth/logout');
  setAccessToken(null);
  navigate('/login');
};

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
     
        <div className="relative w-96 max-w-md">
       

          {open && (
            <div className="absolute z-50 mt-2 w-full rounded-md border bg-background shadow-lg">
              {results.map((item) => (
                <div
                  key={item.type + item.id}
                  className="cursor-pointer px-4 py-2 hover:bg-muted"
                >
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      
        <div className="flex items-center gap-3">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {recentLogs.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Recent Activity</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <DropdownMenuItem
                    key={log.id}
                    className="flex flex-col items-start gap-1 py-3"
                  >
                    <span className="text-sm font-medium">{log.entityName}</span>
                    <span className="text-xs text-muted-foreground">{log.details}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No recent activity</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive"onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
