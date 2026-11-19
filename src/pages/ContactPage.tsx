import { useState } from "react";
import {
  Mail,
  MapPin,
  Clock,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { sendContactMessage } from "../services/contactService";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError("Harap isi seluruh kolom formulir kontak.");
      return;
    }

    setSubmitting(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err?.message || "Gagal mengirim pesan kontak. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Wave Header */}
      <section
        style={{
          background: "linear-gradient(180deg, #E2EEFB 0%, #F4F8FC 100%)",
          padding: "60px 24px 30px",
          textAlign: "center",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#0F2942",
              letterSpacing: "-0.5px",
              marginBottom: "10px",
            }}
          >
            Hubungi Kami
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500 }}>
            Punya pertanyaan mengenai event kampus atau memerlukan bantuan teknis EventKu?
            Kirimkan pesanmu kepada tim panitia & admin kampus.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div style={{ maxWidth: "1100px", margin: "40px auto 0", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "36px",
            alignItems: "start",
          }}
        >
          {/* Left: Contact Form Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#DBEAFE",
                  color: "#1D77F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquare size={20} />
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0F2942" }}>
                Kirim Pesan
              </h2>
            </div>

            {success && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#DCFCE7",
                  color: "#15803D",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={18} />
                <span>Pesanmu telah tersimpan di sistem kami! Tim panitia akan segera merespons via email.</span>
              </div>
            )}

            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#FEE2E2",
                  color: "#B91C1C",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                  Nama Lengkap <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Dinda Permata"
                  value={form.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                  Email Institusi / Email Aktif <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Contoh: mahasiswa@campus.edu"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                  Subjek Pesan <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Contoh: Kendala Tiket Konser Kampus 2027"
                  value={form.subject}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                  Isi Pesan <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tuliskan pertanyaan, masukan, atau kendala yang kamu alami secara rinci..."
                  value={form.message}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "14px 24px",
                  borderRadius: "999px",
                  backgroundColor: "#1D77F2",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "14.5px",
                  cursor: "pointer",
                  marginTop: "8px",
                  boxShadow: "0 4px 14px rgba(29, 119, 242, 0.3)",
                }}
              >
                <Send size={16} /> {submitting ? "Mengirim Pesan..." : "Kirim Pesan Sekarang"}
              </button>
            </form>
          </div>

          {/* Right: Contact Information Box */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "32px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F2942", marginBottom: "20px" }}>
                Pusat Layanan Mahasiswa
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      backgroundColor: "#EFF6FF",
                      color: "#1D77F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "#0F2942", fontSize: "14px" }}>Lokasi Kantor</strong>
                    <span style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.5 }}>
                      Gedung Student Center Lantai 2, Kampus Terpadu
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      backgroundColor: "#EFF6FF",
                      color: "#1D77F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "#0F2942", fontSize: "14px" }}>Email Resmi</strong>
                    <span style={{ fontSize: "13.5px", color: "#64748B" }}>
                      eventku@campus.edu / support@eventku.ac.id
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      backgroundColor: "#EFF6FF",
                      color: "#1D77F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "#0F2942", fontSize: "14px" }}>Jam Layanan</strong>
                    <span style={{ fontSize: "13.5px", color: "#64748B" }}>
                      Senin – Jumat: 08.00 – 16.30 WITA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Note */}
            <div
              style={{
                backgroundColor: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: "20px",
                padding: "20px",
                color: "#1E40AF",
                fontSize: "13.5px",
                lineHeight: 1.6,
              }}
            >
              💡 <strong>Catatan:</strong> Tiket event yang telah terdaftar dapat langsung diakses melalui menu{" "}
              <strong>E-Ticket</strong> pada Dashboard Mahasiswa tanpa perlu menunggu balasan email.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
