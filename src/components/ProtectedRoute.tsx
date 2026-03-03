import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const toastShown = useRef(false);

  const isUnauthorized = allowedRoles && user && !allowedRoles.includes(user.role);

  useEffect(() => {
    if (isUnauthorized && !toastShown.current) {
      toastShown.current = true;
      toast.error("No tiene permisos para acceder a esta sección.");
    }
  }, [isUnauthorized]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-heading">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isUnauthorized) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

