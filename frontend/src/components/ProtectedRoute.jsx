// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const access = localStorage.getItem("access");

  if (!access) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  // ✅ Always render children when logged in
  return children;
}
