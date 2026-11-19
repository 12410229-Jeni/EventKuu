import type { ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { currentUser, userProfile, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Memeriksa proses autentikasi
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <p>Memeriksa akun...</p>
      </div>
    );
  }

  // Jika belum login, arahkan ke halaman login
  if (!currentUser) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Jika bukan admin, tampilkan akses ditolak
  if (!isAdmin) {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <ShieldAlert size={48} />

          <h1>Akses Ditolak</h1>

          <p>
            Halaman ini hanya dapat diakses oleh administrator.
          </p>

          <p>
            Role akun kamu: <strong>{userProfile?.role || "user"}</strong>
          </p>

          <Link to="/dashboard" className="btn btn-primary">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Jika admin, tampilkan halaman yang diminta
  return <>{children}</>;
};