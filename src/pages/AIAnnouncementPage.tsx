import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Sparkles,
  RefreshCw,
  Edit3,
  Save,
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Tag,
  FileText,
  Calendar,
  Building,
} from "lucide-react";
import { generateAnnouncementDraft } from "../services/aiService";
import { createAnnouncement } from "../services/announcementService";
import type { AnnouncementCategory } from "../types";

export default function AIAnnouncementPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefillPrompt = searchParams.get("prompt") || "";

  // Input Admin
  const [instruction, setInstruction] = useState(
    prefillPrompt ||
      "Buat pengumuman resmi bahwa pendaftaran Konser Musik Kampus 2027 telah resmi dibuka mulai hari ini, dengan kuota 1.200 penonton dan pendaftaran digital via EventKu."
  );
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory>("Event");

  // Output State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Result Draft
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState<AnnouncementCategory>("Event");
  const [draftSummary, setDraftSummary] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [sourceTag, setSourceTag] = useState("");

  // Handler Generate AI (Gemini 2.5 Flash backend)
  const handleGenerate = async () => {
    if (!instruction.trim()) {
      setError("Silakan masukkan instruksi pengumuman.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await generateAnnouncementDraft({
        instruction: instruction.trim(),
        prompt: instruction.trim(),
        category: selectedCategory,
      });

      if (!response.success || !response.announcement) {
        throw new Error(response.error || "Gagal membuat pengumuman dari server AI.");
      }

      const ann = response.announcement;
      setDraftTitle(ann.title);
      setDraftCategory(ann.category || selectedCategory);
      setDraftSummary(ann.summary);
      setDraftContent(ann.content || ann.fullText || "");
      setSourceTag(response.source || "Google Gemini 2.5 Flash");
      setHasGenerated(true);
      setIsEditing(false);
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError(
        err?.message ||
          "Gagal menghubungi server AI. Pastikan server backend EventKu (port 3001) sedang berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  // Simpan Draf ke Firestore
  const handleSaveDraft = async () => {
    if (!draftTitle || !draftContent) return;
    try {
      await createAnnouncement({
        title: draftTitle,
        category: draftCategory,
        summary: draftSummary,
        content: draftContent,
        status: "draft",
        createdBy: "Admin Kampus (AI Draft)",
      });
      setSuccessMsg("Draf pengumuman berhasil disimpan! Status: Draf (Belum Publik).");
    } catch (err: any) {
      setError("Gagal menyimpan draf: " + err.message);
    }
  };

  // Publikasikan ke Firestore & Langsung Muncul di Halaman Pengumuman Publik
  const handlePublish = async () => {
    if (!draftTitle || !draftContent) return;
    try {
      await createAnnouncement({
        title: draftTitle,
        category: draftCategory,
        summary: draftSummary,
        content: draftContent,
        status: "published",
        createdBy: "Admin Kampus",
      });
      setSuccessMsg("Pengumuman berhasil dipublikasikan! Sekarang tampil di halaman Pengumuman publik.");
      setTimeout(() => {
        navigate("/announcements");
      }, 1500);
    } catch (err: any) {
      setError("Gagal mempublikasikan pengumuman: " + err.message);
    }
  };

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        
        {/* Navigation & Header */}
        <div style={{ marginBottom: "28px" }}>
          <Link
            to="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#1D77F2",
              fontWeight: 600,
              fontSize: "13.5px",
              textDecoration: "none",
              marginBottom: "12px",
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Admin Dashboard
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#EFF6FF",
                color: "#1D77F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>
                AI Announcement Generator ✨
              </h1>
              <p style={{ fontSize: "14px", color: "#64748B" }}>
                Fitur AI terintegrasi untuk membantu Administrator menyusun draf pengumuman kampus secara instan dan profesional.
              </p>
            </div>
          </div>
        </div>

        {/* Input Section Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
            marginBottom: "32px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13.5px", fontWeight: 700, color: "#1E293B", marginBottom: "8px" }}>
              Instruksi Pengumuman untuk AI (Prompt) <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Contoh: Buat pengumuman bahwa pendaftaran seminar teknologi kecerdasan buatan dibuka, kuota 500 orang, gratis dan bersertifikat..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
                fontFamily: "inherit",
                lineHeight: 1.6,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>Kategori Sasaran:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AnnouncementCategory)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="Event">Event</option>
                <option value="Informasi">Informasi</option>
                <option value="Penting">Penting</option>
              </select>
            </div>

            {/* Tombol Generate Announcement & Regenerate */}
            <div style={{ display: "flex", gap: "10px" }}>
              {hasGenerated && (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "11px 22px",
                    borderRadius: "999px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                    color: "#334155",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={15} className={loading ? "spin" : ""} /> Regenerate
                </button>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 26px",
                  borderRadius: "999px",
                  backgroundColor: "#1D77F2",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(29, 119, 242, 0.3)",
                }}
              >
                <Sparkles size={16} />
                {loading ? "Sedang Menyusun Pengumuman..." : "Generate Announcement"}
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Notifications */}
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
              marginBottom: "24px",
              fontSize: "13.5px",
              fontWeight: 600,
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#DCFCE7",
              color: "#15803D",
              padding: "14px 18px",
              borderRadius: "14px",
              marginBottom: "24px",
              fontSize: "13.5px",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* AI Output Review & Editor Card */}
        {hasGenerated && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
            }}
          >
            {/* Header Result */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "18px",
                borderBottom: "1px solid #F1F5F9",
                marginBottom: "24px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#1D77F2",
                  }}
                >
                  HASIL DRAF AI (GEMINI 2.5 FLASH)
                </span>
                <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#0F2942", marginTop: "2px" }}>
                  Tinjauan & Edit Pengumuman
                </h2>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 18px",
                    borderRadius: "999px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: isEditing ? "#EFF6FF" : "#FFFFFF",
                    color: isEditing ? "#1D77F2" : "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Edit3 size={15} /> {isEditing ? "Selesai Edit" : "Edit Draf"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${draftTitle}\n\n${draftSummary}\n\n${draftContent}`);
                    alert("Teks pengumuman berhasil disalin ke clipboard!");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#F8FAFC",
                    color: "#475569",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                  title="Salin Teks"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            {/* Form Fields: Judul, Kategori, Summary, Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Judul */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1E293B", marginBottom: "6px" }}>
                  Judul Pengumuman
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  />
                ) : (
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F2942" }}>{draftTitle}</h3>
                )}
              </div>

              {/* Kategori & Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1E293B", marginBottom: "6px" }}>
                    Kategori
                  </label>
                  {isEditing ? (
                    <select
                      value={draftCategory}
                      onChange={(e) => setDraftCategory(e.target.value as AnnouncementCategory)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "13.5px",
                      }}
                    >
                      <option value="Event">Event</option>
                      <option value="Informasi">Informasi</option>
                      <option value="Penting">Penting</option>
                    </select>
                  ) : (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 14px",
                        borderRadius: "999px",
                        backgroundColor: "#DBEAFE",
                        color: "#1D77F2",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {draftCategory}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1E293B", marginBottom: "6px" }}>
                    Ringkasan Singkat (Summary Card)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={draftSummary}
                      onChange={(e) => setDraftSummary(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "13.5px",
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: "13.5px", color: "#64748B", fontStyle: "italic" }}>
                      "{draftSummary}"
                    </p>
                  )}
                </div>
              </div>

              {/* Konten Lengkap */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1E293B", marginBottom: "6px" }}>
                  Isi Lengkap Pengumuman
                </label>
                {isEditing ? (
                  <textarea
                    rows={8}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "1px solid #CBD5E1",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      lineHeight: 1.7,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      padding: "20px",
                      borderRadius: "16px",
                      fontSize: "14.5px",
                      lineHeight: 1.8,
                      color: "#334155",
                      whiteSpace: "pre-line",
                      border: "1px solid #F1F5F9",
                    }}
                  >
                    {draftContent}
                  </div>
                )}
              </div>

              {/* Source attribution */}
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                Sumber Mesin AI: <strong>{sourceTag}</strong>
              </div>

              {/* Action Buttons: Save Draft & Publish matching Master Prompt */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  paddingTop: "20px",
                  borderTop: "1px solid #F1F5F9",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "11px 24px",
                    borderRadius: "999px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                    color: "#475569",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <Save size={16} /> Simpan sebagai Draf
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "11px 28px",
                    borderRadius: "999px",
                    backgroundColor: "#16A34A",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
                  }}
                >
                  <Send size={16} /> Publikasikan Pengumuman
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
