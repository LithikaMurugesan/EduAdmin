// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { useDataStore } from '@/store/dataStore';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import {
//   Building2,
//   Users,
//   GraduationCap,
//   Plus,
//   Pencil,
//   Trash2,
//   RotateCcw,
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { cn } from '@/lib/utils';

// /* ---------------- icon maps ---------------- */

// const entityIcons: Record<string, any> = {
//   University: Building2,
//   Department: Users,
//   Student: GraduationCap,
// };

// const actionIcons: Record<string, any> = {
//   Create: Plus,
//   Update: Pencil,
//   Delete: Trash2,
//   Restore: RotateCcw,
// };

// const actionColors: Record<string, string> = {
//   Create: 'bg-success/10 text-success border-success/20',
//   Update: 'bg-warning/10 text-warning border-warning/20',
//   Delete: 'bg-destructive/10 text-destructive border-destructive/20',
//   Restore: 'bg-primary/10 text-primary border-primary/20',
// };

// /* ---------------- component ---------------- */

// const ActivityLogs = () => {
//   const { activityLogs = [] } = useDataStore(); // ✅ safe default

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="animate-fade-in">
//           <h1 className="text-3xl font-bold tracking-tight">
//             Activity Logs
//           </h1>
//           <p className="text-muted-foreground">
//             Track all admin actions in the system
//           </p>
//         </div>

//         {/* Table */}
//         <div className="rounded-xl border border-border bg-card animate-slide-up">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Action</TableHead>
//                 <TableHead>Entity Type</TableHead>
//                 <TableHead>Entity Name</TableHead>
//                 <TableHead>Details</TableHead>
//                 <TableHead>Timestamp</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {activityLogs.length > 0 ? (
//                 activityLogs.map((log: any, index: number) => {
//                   const EntityIcon =
//                     entityIcons[log.entityType] || Users;
//                   const ActionIcon =
//                     actionIcons[log.action] || Plus;

//                   return (
//                     <TableRow
//                       key={log._id || index} // ✅ safe key
//                       className="animate-slide-up"
//                       style={{ animationDelay: `${index * 30}ms` }}
//                     >
//                       <TableCell>
//                         <Badge
//                           variant="outline"
//                           className={cn(
//                             'gap-1',
//                             actionColors[log.action] ||
//                               'bg-muted text-muted-foreground'
//                           )}
//                         >
//                           <ActionIcon className="h-3 w-3" />
//                           {log.action || 'Unknown'}
//                         </Badge>
//                       </TableCell>

//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <EntityIcon className="h-4 w-4 text-muted-foreground" />
//                           <span>{log.entityType || '—'}</span>
//                         </div>
//                       </TableCell>

//                       <TableCell className="font-medium">
//                         {log.entityName || '—'}
//                       </TableCell>

//                       <TableCell className="text-muted-foreground max-w-[300px] truncate">
//                         {log.details || '—'}
//                       </TableCell>

//                       <TableCell className="text-muted-foreground">
//                         {log.timestamp
//                           ? format(
//                               new Date(log.timestamp),
//                               'MMM d, yyyy h:mm a'
//                             )
//                           : '—'}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={5}
//                     className="h-24 text-center text-muted-foreground"
//                   >
//                     No activity logged yet
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Count */}
//         <div className="text-sm text-muted-foreground">
//           Showing {activityLogs.length} activity logs
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ActivityLogs;


import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useActivityLogs } from '@/hooks/useActivityLogs';

/* ---------------- icon maps ---------------- */

const entityIcons: Record<string, any> = {
  University: Building2,
  Department: Users,
  Student: GraduationCap,
};

const actionIcons: Record<string, any> = {
  Create: Plus,
  Update: Pencil,
  Delete: Trash2,
  Restore: RotateCcw,
};

const actionColors: Record<string, string> = {
  Create: 'bg-success/10 text-success border-success/20',
  Update: 'bg-warning/10 text-warning border-warning/20',
  Delete: 'bg-destructive/10 text-destructive border-destructive/20',
  Restore: 'bg-primary/10 text-primary border-primary/20',
};



const ActivityLogs = () => {
  const { data: activityLogs = [], isLoading } = useActivityLogs();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Activity Logs
          </h1>
          <p className="text-muted-foreground">
            Track all admin actions in the system
          </p>
        </div>

        
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity Name</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading activity logs...
                  </TableCell>
                </TableRow>
              ) : activityLogs.length > 0 ? (
                activityLogs.map((log: any, index: number) => {
                  const EntityIcon =
                    entityIcons[log.entityType] || Users;
                  const ActionIcon =
                    actionIcons[log.action] || Plus;

                  return (
                    <TableRow key={log._id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'gap-1',
                            actionColors[log.action]
                          )}
                        >
                          <ActionIcon className="h-3 w-3" />
                          {log.action}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <EntityIcon className="h-4 w-4 text-muted-foreground" />
                          {log.entityType}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {log.entityName || '—'}
                      </TableCell>

                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {log.details || '—'}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {log.userId?.fullName || 'System'}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {log.createdAt
                          ? format(
                              new Date(log.createdAt),
                              'MMM d, yyyy h:mm a'
                            )
                          : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No activity logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      
        <div className="text-sm text-muted-foreground">
          Showing {activityLogs.length} activity logs
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLogs;
