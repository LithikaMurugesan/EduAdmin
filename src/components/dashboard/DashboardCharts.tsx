import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#ef4444'];

interface University {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  isDeleted?: boolean;
  departmentId?: {
    universityId?: {
      _id: string;
    };
  };
  academicStatus?: string;
  status?: string;
}

interface DashboardChartsProps {
  students: Student[];
  universities: University[];
}

export function DashboardCharts({ students, universities }: DashboardChartsProps) {
  
  const studentsPerUniversity = universities.map((uni) => ({
    name: uni.name.length > 15 ? uni.name.substring(0, 15) + '...' : uni.name,
    value: students.filter(
      (s) =>
        !s.isDeleted &&
        s.departmentId?.universityId?._id?.toString() === uni._id?.toString()
    ).length,
  }));

  const statusMap: Record<string, number> = {};
  students.forEach((s) => {
    if (!s.isDeleted) {
      const status = s.academicStatus || s.status || 'Unknown';
      statusMap[status] = (statusMap[status] || 0) + 1;
    }
  });
  const academicStatusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

 
  const noUniversityData = studentsPerUniversity.length === 0;
  const noStatusData = academicStatusData.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <Card>
        <CardHeader>
          <CardTitle>Students per University</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {noUniversityData ? (
            <p className="text-muted-foreground text-center mt-24">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsPerUniversity}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    
      <Card>
        <CardHeader>
          <CardTitle>Academic Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {noStatusData ? (
            <p className="text-muted-foreground text-center mt-24">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={academicStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {academicStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
