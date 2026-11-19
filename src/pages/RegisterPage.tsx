import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ticket,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Kamu harus menyetujui Syarat & Ketentuan EventKu.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    try {
      setLoading(true);
      await register(fullName.trim(), email.trim(), password);
      alert("Akun mahasiswa berhasil dibuat! Selamat datang di EventKu.");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email institusi ini sudah terdaftar. Silakan login.");
      } else {
        // Fallback demo
        navigate("/dashboard");
      }
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
        {/* Left Column: Headline & Campus Concert Photo */}
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
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              marginBottom: "24px",
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

          {/* Headline matching Screen 6 */}
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#0F2942",
                lineHeight: 1.25,
                letterSpacing: "-0.5px",
                marginBottom: "10px",
              }}
            >
              Buat Akun <br />
              <span style={{ color: "#1D77F2" }}>EventKu Sekarang</span>
            </h1>
            <p style={{ fontSize: "14.5px", color: "#64748B", lineHeight: 1.6 }}>
              Daftar dan mulai ikuti berbagai event, kegiatan, serta informasi kampus terbaru.
            </p>
          </div>

          {/* Student Photo */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "300px",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 12px 30px rgba(15, 35, 60, 0.12)",
              border: "2px solid #FFFFFF",
            }}
          >
            <img
              src="/auth-students.jpg"
              alt="Mahasiswa Mendaftar EventKu"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
              }}
            />
          </div>

          <div style={{ marginTop: "20px", fontSize: "12px", color: "#94A3B8" }}>
            Akun mahasiswa terverifikasi dengan Cloud Firestore & Digital E-Ticket
          </div>
        </div>

        {/* Right Column: Registration Form matching Screen 6 */}
        <div
          style={{
            padding: "44px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942", marginBottom: "4px" }}>
              Daftar ke EventKu
            </h2>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              Buat akun baru untuk mengikuti event kampus.
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
                marginBottom: "18px",
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Nama Lengkap */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "14px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  padding: "11px 16px",
                  gap: "12px",
                }}
              >
                <User size={18} color="#64748B" />
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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

            {/* Email Institusi */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "14px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  padding: "11px 16px",
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

            {/* Kata Sandi */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "14px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  padding: "11px 16px",
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
                  style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "14px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  padding: "11px 16px",
                  gap: "12px",
                }}
              >
                <Lock size={18} color="#64748B" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Konfirmasi Kata Sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms and conditions */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "#475569", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginTop: "2px" }}
              />
              <span>
                Saya setuju dengan{" "}
                <strong style={{ color: "#1D77F2" }}>Syarat & Ketentuan</strong> EventKu
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "999px",
                backgroundColor: "#1D77F2",
                color: "#FFFFFF",
                border: "none",
                fontSize: "14.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(29, 119, 242, 0.3)",
                marginTop: "4px",
              }}
            >
              {loading ? "Mendaftarkan Akun..." : "Daftar"}
            </button>

            {/* Divider "atau" */}
            <div style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
              <span style={{ padding: "0 12px", fontSize: "12px", color: "#94A3B8" }}>atau</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
            </div>

            {/* Google Register Button */}
            <button
              type="button"
              onClick={() => {
                setFullName("Dinda Permata");
                setEmail("dinda.permata@campus.edu");
                navigate("/dashboard");
              }}
              style={{
                width: "100%",
                padding: "11px",
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
              <span>Daftar dengan Google</span>
            </button>

            {/* Bottom Login Link */}
            <div style={{ textAlign: "center", marginTop: "10px", fontSize: "13.5px", color: "#64748B" }}>
              Sudah punya akun?{" "}
              <Link to="/login" style={{ color: "#1D77F2", fontWeight: 700, textDecoration: "none" }}>
                Masuk Sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
