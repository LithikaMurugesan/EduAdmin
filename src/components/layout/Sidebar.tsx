import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  School,          
  Users,
  GraduationCap,
  Activity,
  Trash2,
  UserCog,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, superadminOnly: false },

  { name: 'Universities', href: '/universities', icon: Building2, superadminOnly: false },

  { name: 'Colleges', href: '/colleges', icon: School, superadminOnly: false },

  { name: 'Departments', href: '/departments', icon: Users, superadminOnly: false },

  { name: 'Faculty', href: '/faculty', icon: User, superadminOnly: false },

  { name: 'Students', href: '/students', icon: GraduationCap, superadminOnly: false },

  { name: 'Activity Logs', href: '/activity', icon: Activity, superadminOnly: false },

  { name: 'Recycle Bin', href: '/recycle-bin', icon: Trash2, superadminOnly: false },

  { name: 'Manage Admins', href: '/manage-admins', icon: UserCog, superadminOnly: true },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { isSuperadmin, signOut, user } = useAuth();

  const filteredNavigation = navigation.filter(
    (item) => !item.superadminOnly || isSuperadmin
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">EduAdmin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

      
        <nav className="flex-1 space-y-1 p-3">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                {!collapsed && (
                  <span className="animate-fade-in">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          {!collapsed && user && (
            <div className="px-3 py-2 text-xs text-sidebar-foreground/50 truncate">
              {isSuperadmin ? 'Superadmin' : 'Admin'}
            </div>
          )}
          <Button
            variant="ghost"
            onClick={signOut}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full justify-start',
              'text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
