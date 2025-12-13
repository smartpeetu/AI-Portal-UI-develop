// src/routes/protectedRoutes.tsx
import { Navigate, Outlet } from "react-router";
import type { Persona } from "@/config/navigation";

const getPersona = (): Persona | null => {
  const raw = localStorage.getItem("persona");
  if (!raw) return null;

  // 1) Try JSON.parse, to match Sidebar behavior
  try {
    const parsed = JSON.parse(raw);

    if (parsed === "user" || parsed === "developer" || parsed === "admin") {
      return parsed;
    }
  } catch {
    // ignore and fallback to raw string
  }

  // 2) Fallback: treat raw as plain string
  if (raw === "user" || raw === "developer" || raw === "admin") {
    return raw;
  }

  return null;
};

interface ProtectedRouteProps {
  allowedPersonas?: Persona[];
}

const ProtectedRoute = ({ allowedPersonas }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // No role restriction: allow any authenticated user
  if (!allowedPersonas || allowedPersonas.length === 0) {
    return <Outlet />;
  }

  const persona = getPersona();

  if (!persona || !allowedPersonas.includes(persona)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
