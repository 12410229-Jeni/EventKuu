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
  ShieldCheck,
} from "lucide-react";
import { useAuth, isSystemAdminEmail } from "../context/AuthContext";
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

  const fillAdminAccount = () => {
    setEmail("admin@eventku.id");
    setPassword("admin123456");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const profile = await login(email.trim(), password);

      // Memeriksa role pengguna secara strictly dari profil Firestore / Admin Sistem
      if (profile?.role === "admin" || isSystemAdminEmail(email)) {
        navigate("/admin");
      } else {
        const redirectParam = new URLSearchParams(window.location.search).get("redirect");
        if (redirectParam && !redirectParam.startsWith("/admin")) {
          navigate(redirectParam);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMsg = "Email atau kata sandi tidak valid. Silakan periksa kembali.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        errorMsg = "Email atau kata sandi salah. Pastikan akun sudah terdaftar.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Format email tidak valid.";
      } else if (err.code === "auth/user-disabled") {
        errorMsg = "Akun ini telah dinonaktifkan oleh administrator.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Terlalu banyak percobaan login gagal. Silakan coba beberapa saat lagi.";
      } else if (err.code === "auth/network-request-failed") {
        errorMsg = "Koneksi jaringan gagal. Periksa koneksi internet Anda.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
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
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942", marginBottom: "6px" }}>
              Masuk ke EventKu
            </h2>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              Akses akunmu untuk mengikuti event, melihat informasi, dan menerima pengumuman.
            </p>
          </div>

          {/* Quick Admin Access Info Box */}
          <div
            style={{
              backgroundColor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "14px",
              padding: "12px 14px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={18} color="#16A34A" />
              <div style={{ fontSize: "12px", color: "#166534", lineHeight: 1.4 }}>
                <strong>Akun Admin:</strong> <code>admin@eventku.id</code> <br />
                <span>Password: <code>admin123456</code></span>
              </div>
            </div>
            <button
              type="button"
              onClick={fillAdminAccount}
              style={{
                backgroundColor: "#16A34A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(22, 163, 74, 0.25)",
              }}
            >
              Isi Admin
            </button>
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
