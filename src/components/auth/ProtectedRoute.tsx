import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperadmin?: boolean;
}

export function ProtectedRoute({ children, requireSuperadmin = false }: ProtectedRouteProps) {
  const { user, role, loading, isAdmin, isSuperadmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Pending</h2>
          <p className="text-muted-foreground mb-6">
            Your account is awaiting role assignment. Please contact a superadmin to get access to the dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Refresh to check status
          </button>
        </div>
      </div>
    );
  }

  if (requireSuperadmin && !isSuperadmin) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
