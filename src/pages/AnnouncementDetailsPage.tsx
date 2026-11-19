import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Megaphone,
  User,
  Share2,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { getAnnouncementById } from "../services/announcementService";
import type { Announcement } from "../types";

export default function AnnouncementDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await getAnnouncementById(id);
        setAnnouncement(data);
      } catch (err) {
        console.error("Gagal mengambil detail pengumuman:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: "60px 24px", minHeight: "80vh", backgroundColor: "#F4F8FC" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", height: "300px", backgroundColor: "#FFFFFF", borderRadius: "24px" }}></div>
      </main>
    );
  }

  if (!announcement) {
    return (
      <main style={{ padding: "80px 24px", minHeight: "80vh", backgroundColor: "#F4F8FC", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#FFFFFF", padding: "40px", borderRadius: "24px", border: "1px solid #E2E8F0" }}>
          <Info size={48} color="#94A3B8" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0F2942" }}>Pengumuman Tidak Ditemukan</h2>
          <p style={{ color: "#64748B", fontSize: "14px", marginTop: "8px", marginBottom: "24px" }}>
            Informasi pengumuman yang Anda cari mungkin telah diarsipkan atau dipindahkan.
          </p>
          <Link
            to="/announcements"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              borderRadius: "999px",
              backgroundColor: "#1D77F2",
              color: "#FFFFFF",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Pengumuman
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "90vh", padding: "50px 24px 80px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Back Link */}
        <div style={{ marginBottom: "24px" }}>
          <Link
            to="/announcements"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#1D77F2",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Semua Pengumuman
          </Link>
        </div>

        {/* Announcement Content Box */}
        <article
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
          }}
        >
          {/* Top Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                backgroundColor:
                  announcement.category === "Event"
                    ? "#DBEAFE"
                    : announcement.category === "Penting"
                    ? "#FEE2E2"
                    : "#E0F2FE",
                color:
                  announcement.category === "Event"
                    ? "#1D77F2"
                    : announcement.category === "Penting"
                    ? "#E11D48"
                    : "#0284C7",
              }}
            >
              {announcement.category}
            </span>

            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B" }}>
              <Calendar size={14} color="#1D77F2" /> {String(announcement.publishedAt || announcement.createdAt || "12 Nov 2026")}
            </span>

            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B" }}>
              <User size={14} color="#1D77F2" /> {announcement.createdBy || "Admin Kampus"}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#0F2942",
              lineHeight: 1.35,
              marginBottom: "18px",
            }}
          >
            {announcement.title}
          </h1>

          {/* Summary Lead Card */}
          <div
            style={{
              backgroundColor: "#F0F6FD",
              borderLeft: "4px solid #1D77F2",
              padding: "16px 20px",
              borderRadius: "0 14px 14px 0",
              fontSize: "15px",
              fontWeight: 500,
              color: "#1E293B",
              marginBottom: "30px",
              lineHeight: 1.6,
            }}
          >
            {announcement.summary}
          </div>

          {/* Optional Banner Image */}
          {announcement.imageURL && (
            <div style={{ marginBottom: "30px", borderRadius: "18px", overflow: "hidden", maxHeight: "380px" }}>
              <img
                src={announcement.imageURL}
                alt={announcement.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Content Body */}
          <div
            style={{
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#334155",
              whiteSpace: "pre-line",
            }}
          >
            {announcement.content}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid #EEF2F6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Link
              to="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "999px",
                backgroundColor: "#1D77F2",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "13.5px",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(29, 119, 242, 0.25)",
              }}
            >
              Lihat Event Terkait
            </Link>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Tautan pengumuman berhasil disalin ke papan klip!");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                borderRadius: "999px",
                backgroundColor: "#F1F5F9",
                color: "#475569",
                fontWeight: 600,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Share2 size={15} /> Bagikan Pengumuman
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}
