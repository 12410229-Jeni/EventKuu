import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  Calendar,
  Info,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { getPublishedAnnouncements } from "../services/announcementService";
import type { Announcement, AnnouncementCategory } from "../types";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getPublishedAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error("Gagal mengambil pengumuman:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const getCategoryIcon = (category: AnnouncementCategory) => {
    switch (category) {
      case "Event":
        return <Megaphone size={22} color="#1D77F2" />;
      case "Informasi":
        return <Calendar size={22} color="#0284C7" />;
      case "Penting":
        return <Info size={22} color="#E11D48" />;
      default:
        return <Info size={22} color="#1D77F2" />;
    }
  };

  const getCategoryBadgeStyle = (category: AnnouncementCategory) => {
    switch (category) {
      case "Event":
        return { backgroundColor: "#DBEAFE", color: "#1D77F2" };
      case "Informasi":
        return { backgroundColor: "#E0F2FE", color: "#0284C7" };
      case "Penting":
        return { backgroundColor: "#FEE2E2", color: "#E11D48" };
      default:
        return { backgroundColor: "#EFF6FF", color: "#1D77F2" };
    }
  };

  return (
    <main
      className="announcements-page"
      style={{
        backgroundColor: "#F4F8FC",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      {/* Wave Header matching UI Reference */}
      <section
        style={{
          background: "linear-gradient(180deg, #E2EEFB 0%, #F4F8FC 100%)",
          padding: "60px 24px 30px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#0F2942",
                  letterSpacing: "-0.5px",
                }}
              >
                Pengumuman
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "#64748B",
                  marginTop: "6px",
                  fontWeight: 500,
                }}
              >
                Informasi terbaru seputar event dan kegiatan di kampus.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar matching Screen Reference */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "32px",
              flexWrap: "wrap",
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: 1,
                minWidth: "280px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: "999px",
                border: "1px solid #DCE6F1",
                padding: "4px 20px",
                boxShadow: "0 2px 8px rgba(15, 35, 60, 0.04)",
              }}
            >
              <Search size={18} color="#64748B" style={{ marginRight: "10px" }} />
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  padding: "10px 0",
                  backgroundColor: "transparent",
                  color: "#1E293B",
                }}
              />
            </div>

            {/* Category Filter Dropdown */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: "999px",
                border: "1px solid #DCE6F1",
                padding: "4px 20px",
                boxShadow: "0 2px 8px rgba(15, 35, 60, 0.04)",
              }}
            >
              <Filter size={16} color="#1D77F2" style={{ marginRight: "8px" }} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  color: "#0F2942",
                  cursor: "pointer",
                  padding: "10px 4px",
                }}
              >
                <option value="All">Semua Kategori</option>
                <option value="Event">Event</option>
                <option value="Informasi">Informasi</option>
                <option value="Penting">Penting</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements List Container */}
      <section style={{ maxWidth: "1100px", margin: "32px auto 0", padding: "0 24px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: "110px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1px solid #E2E8F0",
                  animation: "pulse 1.5s infinite",
                }}
              ></div>
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "60px 24px",
              textAlign: "center",
              border: "1px solid #E2E8F0",
            }}
          >
            <Info size={48} color="#94A3B8" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F2942" }}>
              Tidak ada pengumuman ditemukan
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>
              Coba kata kunci lain atau ubah filter kategori.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredAnnouncements.map((item) => (
              <Link
                key={item.id}
                to={`/announcements/${item.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px 24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  gap: "20px",
                }}
                className="announcement-card-hover"
              >
                {/* Left side with icon & details */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1 }}>
                  {/* Icon Box */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "16px",
                      backgroundColor: "#F0F6FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getCategoryIcon(item.category)}
                  </div>

                  {/* Text Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          padding: "3px 12px",
                          borderRadius: "999px",
                          ...getCategoryBadgeStyle(item.category),
                        }}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontSize: "16.5px",
                        fontWeight: 700,
                        color: "#0F2942",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </h2>

                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "#64748B",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.summary}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#1D77F2",
                        fontWeight: 600,
                      }}
                    >
                      <Calendar size={13} />
                      <span>{String(item.publishedAt || item.createdAt || "12 Nov 2026")}</span>
                    </div>
                  </div>
                </div>

                {/* Right Arrow Button matching UI Screenshot */}
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "#EFF6FF",
                    color: "#1D77F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
