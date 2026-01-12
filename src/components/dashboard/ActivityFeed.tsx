
import { ActivityLog } from '@/types';
import { cn } from '@/lib/utils';
import { Building2, Users, GraduationCap, Plus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityFeedProps {
  logs: ActivityLog[];
  className?: string;
}

const entityIcons = {
  University: Building2,
  Department: Users,
  Student: GraduationCap,
};

const actionColors = {
  Create: 'text-success bg-success/10',
  Update: 'text-warning bg-warning/10',
  Delete: 'text-destructive bg-destructive/10',
  Restore: 'text-primary bg-primary/10',
};

const actionIcons = {
  Create: Plus,
  Update: Pencil,
  Delete: Trash2,
  Restore: RotateCcw,
};

const safeFormat = (date: string | Date | undefined, pattern: string) => {
  if (!date) return '—';
  const d = new Date(date);
  return isNaN(d.getTime()) ? '—' : format(d, pattern);
};

export function ActivityFeed({ logs, className }: ActivityFeedProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest actions performed in the system</p>
      </div>

      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log, index) => {
            const EntityIcon =
  entityIcons[log.entity_type as keyof typeof entityIcons] || Users;

const ActionIcon =
  actionIcons[log.action as keyof typeof actionIcons] || Plus;

            return (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className={cn('rounded-lg p-2', actionColors[log.action])}>
                    <ActionIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <EntityIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {log.entityType}
                    </span>
                  </div>
                  <p className="font-medium truncate">{log.entityName}</p>
                  {log.details && (
                    <p className="text-sm text-muted-foreground truncate">{log.details}</p>
                  )}
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">
                    {safeFormat(log.created_at, 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {safeFormat(log.created_at, 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No activity recorded yet
          </div>
        )}
      </div>
    </div>
  );
}
