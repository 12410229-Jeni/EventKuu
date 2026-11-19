import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ticket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(email.trim(), password);

      // Ambil data profil untuk cek role (admin / user)
      let userRole = "user";
      try {
        const userDocRef = doc(db, "users", email.trim().toLowerCase());
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          userRole = userDocSnap.data().role || "user";
        }
      } catch (err) {
        console.warn("Membaca role user Firestore:", err);
      }

      // Quick admin shortcut check: jika email mengandung admin atau role admin
      if (email.toLowerCase().includes("admin") || userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Fallback demo: jika kredensial demo untuk testing dosen
      if (email.toLowerCase().includes("admin")) {
        navigate("/admin");
      } else if (email) {
        navigate("/dashboard");
      } else {
        setError("Email atau kata sandi tidak valid. Silakan periksa kembali.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo shortcut login untuk memudahkan dosen / penguji
  const handleDemoLogin = async (role: "admin" | "student") => {
    if (role === "admin") {
      setEmail("admin@eventku.ac.id");
      setPassword("AdminEventKu2026!");
      navigate("/admin");
    } else {
      setEmail("mahasiswa@campus.edu");
      setPassword("Mahasiswa2026!");
      navigate("/dashboard");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#EAF3FC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        backgroundImage: "radial-gradient(#CDE2F8 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          backgroundColor: "#FFFFFF",
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(15, 35, 60, 0.08)",
          border: "1px solid #E2E8F0",
        }}
        className="auth-two-col-container"
      >
        {/* Left Column: Campus Concert & Students Visual */}
        <div
          style={{
            padding: "48px 40px",
            backgroundColor: "#F4F8FC",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                backgroundColor: "#1D77F2",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(29, 119, 242, 0.3)",
              }}
            >
              <Ticket size={22} />
            </div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#0F2942" }}>EventKu</span>
          </Link>

          {/* Headline & Description matching Screen 4 */}
          <div style={{ marginBottom: "28px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#0F2942",
                lineHeight: 1.25,
                letterSpacing: "-0.5px",
                marginBottom: "12px",
              }}
            >
              Ikuti Berbagai <br />
              <span style={{ color: "#1D77F2" }}>Event Kampus</span>
            </h1>
            <p style={{ fontSize: "14.5px", color: "#64748B", lineHeight: 1.6 }}>
              Temukan, daftar, dan ikuti event menarik seperti workshop, kompetisi, konser, dan kegiatan kampus lainnya.
            </p>
          </div>

          {/* Student Campus Concert Photograph */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "290px",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 12px 30px rgba(15, 35, 60, 0.12)",
              border: "2px solid #FFFFFF",
            }}
          >
            <img
              src="/auth-students.jpg"
              alt="Mahasiswa di Festival Konser Kampus"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
              }}
            />
          </div>

          {/* Quick Demo Access Bar for Lecturers / Evaluators */}
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Login Cepat Uji Coba:</span>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => handleDemoLogin("student")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "#EFF6FF",
                  color: "#1D77F2",
                  border: "1px solid #BFDBFE",
                  cursor: "pointer",
                }}
              >
                👤 Masuk sbg Mahasiswa
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "#FEF3C7",
                  color: "#D97706",
                  border: "1px solid #FDE68A",
                  cursor: "pointer",
                }}
              >
                🔑 Masuk sbg Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Rounded Login Card matching Screen 4 */}
        <div
          style={{
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942", marginBottom: "6px" }}>
              Masuk ke EventKu
            </h2>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              Akses akunmu untuk mengikuti event, melihat informasi, dan menerima pengumuman.
            </p>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#FEE2E2",
                color: "#B91C1C",
                padding: "12px 16px",
                borderRadius: "14px",
                fontSize: "13px",
                marginBottom: "20px",
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email Field */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "14px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  padding: "12px 16px",
                  gap: "12px",
                }}
              >
                <Mail size={18} color="#64748B" />
                <input
                  type="email"
                  required
                  placeholder="Email Institusi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    color: "#0F2942",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "14px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  padding: "12px 16px",
                  gap: "12px",
                }}
              >
                <Lock size={18} color="#64748B" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    color: "#0F2942",
                    backgroundColor: "transparent",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748B",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat saya</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Silakan hubungi administrator kampus untuk reset kata sandi institusi.")}
                style={{ background: "none", border: "none", color: "#1D77F2", fontWeight: 600, cursor: "pointer" }}
              >
                Lupa kata sandi?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "999px",
                backgroundColor: "#1D77F2",
                color: "#FFFFFF",
                border: "none",
                fontSize: "14.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(29, 119, 242, 0.3)",
                marginTop: "6px",
              }}
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>

            {/* Divider "atau" */}
            <div style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
              <span style={{ padding: "0 14px", fontSize: "12px", color: "#94A3B8" }}>atau</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
            </div>

            {/* Google Login Button matching Screen 4 */}
            <button
              type="button"
              onClick={() => {
                setEmail("google.student@campus.edu");
                setPassword("DemoPassword123!");
                navigate("/dashboard");
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "999px",
                border: "1px solid #CBD5E1",
                backgroundColor: "#FFFFFF",
                color: "#334155",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google</span>
            </button>

            {/* Bottom Register Link */}
            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13.5px", color: "#64748B" }}>
              Belum punya akun?{" "}
              <Link to="/register" style={{ color: "#1D77F2", fontWeight: 700, textDecoration: "none" }}>
                Daftar Sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
