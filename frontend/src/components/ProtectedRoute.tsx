import { Navigate } from "react-router";
import { getRefreshToken } from "../auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getRefreshToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
