
import { Building2, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';

import { useUniversities } from '@/hooks/useUniversities';
import { useDepartments } from '@/hooks/useDepartments';
import { useStudents } from '@/hooks/useStudents';
import { useActivityLogs } from '@/hooks/useActivityLogs';

const Dashboard = () => {

  const { data: universities = [], isLoading: uniLoading } = useUniversities();
  const { data: departments = [], isLoading: deptLoading } = useDepartments();
  const { data: students = [], isLoading: studentLoading } = useStudents();
  const { data: activityLogs = [], isLoading: logsLoading } = useActivityLogs();

  const isLoading =
    uniLoading || deptLoading || studentLoading || logsLoading;

  const activeUniversities = universities.filter(u => !u.isDeleted).length;
  const activeDepartments = departments.filter(d => !d.isDeleted).length;
  const activeStudents = students.filter(s => !s.isDeleted).length;

const activeEnrollments = students.filter(
  s =>
    !s.isDeleted &&
    (s.academicStatus === 'Active' || s.status === 'Active')
).length;

  const recentLogs = activityLogs.slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
      
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your university management system.
          </p>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Universities"
            value={isLoading ? '—' : activeUniversities}
            icon={Building2}
            className="animate-slide-up"
          />
          <StatCard
            title="Total Departments"
            value={isLoading ? '—' : activeDepartments}
            icon={Users}
            className="animate-slide-up"
          />
          <StatCard
            title="Total Students"
            value={isLoading ? '—' : activeStudents}
            icon={GraduationCap}
            className="animate-slide-up"
          />
          <StatCard
            title="Active Enrollments"
            value={isLoading ? '—' : activeEnrollments}
            icon={TrendingUp}
            className="animate-slide-up"
          />
        </div>

        
       <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
  <DashboardCharts
    students={students}
    universities={universities}
  />
</div>


        
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <ActivityFeed logs={recentLogs} />
        </div>
      </div>
    </DashboardLayout>
  );
  <DashboardCharts students={students} universities={universities} />

};

export default Dashboard;
