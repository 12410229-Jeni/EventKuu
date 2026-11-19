import { Link } from "react-router-dom";
import {
  Sparkles,
  Ticket,
  Calendar,
  ShieldCheck,
  Zap,
  Users,
  Award,
  ArrowRight,
  BookOpen,
  Cpu,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(180deg, #E2EEFB 0%, #F4F8FC 100%)",
          padding: "60px 24px 40px",
          textAlign: "center",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              backgroundColor: "#FFFFFF",
              color: "#1D77F2",
              fontSize: "12.5px",
              fontWeight: 700,
              marginBottom: "16px",
              boxShadow: "0 2px 8px rgba(15, 35, 60, 0.05)",
            }}
          >
            <Sparkles size={14} /> Tentang EventKu
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#0F2942",
              lineHeight: 1.25,
              marginBottom: "16px",
              letterSpacing: "-0.5px",
            }}
          >
            Discover Events. Connect with Campus.
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#64748B",
              lineHeight: 1.6,
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            EventKu adalah platform digital terintegrasi untuk manajemen dan eksplorasi kegiatan kampus,
            menghubungkan mahasiswa dengan pengalaman akademik, festival seni, turnamen olahraga, dan seminar teknologi.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div style={{ maxWidth: "1100px", margin: "40px auto 0", padding: "0 24px" }}>
        
        {/* Purpose & Platform Description Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0F2942", marginBottom: "16px" }}>
                Tujuan Pengembangan Platform
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "16px" }}>
                Pengelolaan event di lingkungan perguruan tinggi selama ini kerap menghadapi kendala berupa
                publikasi poster yang tersebar secara manual, antrean pendaftaran berbasis formulir kertas,
                serta verifikasi tiket kehadiran yang lambat dan rentan duplikasi.
              </p>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7 }}>
                <strong>EventKu</strong> hadir sebagai solusi berbasis riset dan kecerdasan buatan (AI)
                untuk mendigitalisasi seluruh siklus kegiatan kampus: mulai dari publikasi pengumuman otomatis,
                eksplorasi 8 kategori kegiatan resmi, pendaftaran instan, hingga penerbitan Digital E-Ticket
                dengan QR Code terenkripsi yang dapat diverifikasi dalam hitungan detik.
              </p>
            </div>

            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(15, 35, 60, 0.08)",
                border: "1px solid #E2E8F0",
              }}
            >
              <img
                src="/EventKuu/hero-students.jpg"
                alt="Mahasiswa Kampus EventKu"
                style={{ width: "100%", height: "280px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F2942", marginBottom: "20px" }}>
          Manfaat Utama EventKu
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          {/* Benefit 1 */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#DBEAFE",
                color: "#1D77F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Ticket size={24} />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F2942", marginBottom: "8px" }}>
              Digital E-Ticket & QR Verification
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
              Mahasiswa menerima tiket digital dengan QR Code unik setelah mendaftar. Panitia dapat memindai tiket langsung menggunakan kamera perangkat untuk check-in bebas antrean.
            </p>
          </div>

          {/* Benefit 2 */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#E0F2FE",
                color: "#0284C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F2942", marginBottom: "8px" }}>
              AI Announcement Generator
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
              Administrator dapat membuat draf pengumuman resmi kegiatan kampus secara otomatis hanya dengan memasukkan instruksi singkat, didukung oleh Google Gemini 2.5 Flash.
            </p>
          </div>

          {/* Benefit 3 */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#DCFCE7",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F2942", marginBottom: "8px" }}>
              Keamanan Data & Peran Berjenjang
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
              Proteksi data berbasis Cloud Firestore Security Rules dan Firebase Authentication memastikan mahasiswa hanya mengakses tiketnya sendiri dan admin berhak mengelola acara.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1D77F2 0%, #1752BE 100%)",
            borderRadius: "24px",
            padding: "48px 36px",
            color: "#FFFFFF",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(29, 119, 242, 0.25)",
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "12px", color: "#FFFFFF" }}>
            Siap Bergabung dengan Komunitas Kampus?
          </h2>
          <p style={{ fontSize: "15px", color: "#DBEAFE", maxWidth: "600px", margin: "0 auto 28px" }}>
            Jelajahi seminar, kompetisi, turnamen olahraga, dan konser musik kampus sekarang juga di EventKu.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "999px",
                backgroundColor: "#FFFFFF",
                color: "#1D77F2",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Eksplorasi Event <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              Daftar Akun Mahasiswa
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
