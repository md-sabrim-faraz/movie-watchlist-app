import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, action: "view-watchlist" }}
        replace
      />
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}
