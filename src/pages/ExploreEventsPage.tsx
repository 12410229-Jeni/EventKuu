import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Radio,
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  CalendarDays,
} from "lucide-react";
import { getEvents } from "../services/eventService";
import type { Event, EventCategory } from "../types";
import { EVENT_CATEGORIES } from "../types";

export default function ExploreEventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Tab: 'all' | 'ongoing' | 'upcoming' | 'completed'
  const [statusTab, setStatusTab] = useState<"all" | "ongoing" | "upcoming" | "completed">("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [timeFilter, setTimeFilter] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Gagal mengambil event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  // Counts per status
  const ongoingEvents = useMemo(() => events.filter((e) => e.status === "ongoing"), [events]);
  const upcomingEvents = useMemo(() => events.filter((e) => e.status === "upcoming" || e.status === "published"), [events]);
  const completedEvents = useMemo(() => events.filter((e) => e.status === "completed"), [events]);

  // Filter based on active status tab, search, category
  const filteredEvents = useMemo(() => {
    const baseList =
      statusTab === "all"
        ? events
        : statusTab === "ongoing"
        ? ongoingEvents
        : statusTab === "upcoming"
        ? upcomingEvents
        : completedEvents;

    return baseList.filter((event) => {
      const matchSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "All" || event.category === category;
      return matchSearch && matchCategory;
    });
  }, [statusTab, events, ongoingEvents, upcomingEvents, completedEvents, search, category]);

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Wave Header matching UI Reference Screen 3 */}
      <section
        style={{
          background: "linear-gradient(180deg, #E2EEFB 0%, #F4F8FC 100%)",
          padding: "60px 24px 30px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div style={{ maxWidth: "1220px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#0F2942",
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Event Kampus
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, marginBottom: "28px" }}>
            Temukan dan ikuti berbagai kegiatan kampus sesuai minatmu.
          </p>

          {/* 4 Status Filter Tabs:
              1. 🌟 Semua Event (19)
              2. ((•)) Sedang Berlangsung (6)
              3. 📅 Akan Datang (8)
              4. ✓ Sudah Selesai (5)
          */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => setStatusTab("all")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 20px",
                borderRadius: "999px",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                backgroundColor: statusTab === "all" ? "#1D77F2" : "#FFFFFF",
                color: statusTab === "all" ? "#FFFFFF" : "#475569",
                boxShadow: statusTab === "all" ? "0 4px 14px rgba(29, 119, 242, 0.3)" : "0 2px 6px rgba(0, 0, 0, 0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <CalendarDays size={15} /> Semua Event ({events.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusTab("ongoing")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 20px",
                borderRadius: "999px",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                backgroundColor: statusTab === "ongoing" ? "#1D77F2" : "#FFFFFF",
                color: statusTab === "ongoing" ? "#FFFFFF" : "#475569",
                boxShadow: statusTab === "ongoing" ? "0 4px 14px rgba(29, 119, 242, 0.3)" : "0 2px 6px rgba(0, 0, 0, 0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <Radio size={15} /> Sedang Berlangsung ({ongoingEvents.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusTab("upcoming")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 20px",
                borderRadius: "999px",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                backgroundColor: statusTab === "upcoming" ? "#1D77F2" : "#FFFFFF",
                color: statusTab === "upcoming" ? "#FFFFFF" : "#475569",
                boxShadow: statusTab === "upcoming" ? "0 4px 14px rgba(29, 119, 242, 0.3)" : "0 2px 6px rgba(0, 0, 0, 0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <Calendar size={15} /> Akan Datang ({upcomingEvents.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusTab("completed")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 20px",
                borderRadius: "999px",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                backgroundColor: statusTab === "completed" ? "#1D77F2" : "#FFFFFF",
                color: statusTab === "completed" ? "#FFFFFF" : "#475569",
                boxShadow: statusTab === "completed" ? "0 4px 14px rgba(29, 119, 242, 0.3)" : "0 2px 6px rgba(0, 0, 0, 0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <CheckCircle2 size={15} /> Sudah Selesai ({completedEvents.length})
            </button>
          </div>

          {/* Search Bar & Dropdowns Row matching Screen 3 */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
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
                placeholder="Cari event, tema, atau penyelenggara..."
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

            {/* Category Dropdown */}
            <div
              style={{
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
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory(val);
                  if (val === "All") {
                    searchParams.delete("category");
                    setSearchParams(searchParams);
                  } else {
                    setSearchParams({ category: val });
                  }
                }}
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
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter Dropdown */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: "999px",
                border: "1px solid #DCE6F1",
                padding: "4px 20px",
                boxShadow: "0 2px 8px rgba(15, 35, 60, 0.04)",
              }}
            >
              <CalendarDays size={16} color="#1D77F2" style={{ marginRight: "8px" }} />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
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
                <option value="All">Semua Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="week">Pekan Ini</option>
                <option value="month">Bulan Ini</option>
              </select>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginRight: "4px" }}>
              Kategori:
            </span>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                searchParams.delete("category");
                setSearchParams(searchParams);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "12.5px",
                fontWeight: category === "All" ? 700 : 500,
                cursor: "pointer",
                border: "1px solid",
                borderColor: category === "All" ? "#1D77F2" : "#E2E8F0",
                backgroundColor: category === "All" ? "#1D77F2" : "#FFFFFF",
                color: category === "All" ? "#FFFFFF" : "#334155",
                transition: "all 0.15s ease",
              }}
            >
              Semua
            </button>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setSearchParams({ category: cat });
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "12.5px",
                  fontWeight: category === cat ? 700 : 500,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: category === cat ? "#1D77F2" : "#E2E8F0",
                  backgroundColor: category === cat ? "#1D77F2" : "#FFFFFF",
                  color: category === cat ? "#FFFFFF" : "#334155",
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid matching UI Screen 3 */}
      <section style={{ maxWidth: "1220px", margin: "36px auto 0", padding: "0 24px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "24px" }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: "320px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  border: "1px solid #E2E8F0",
                }}
              ></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "60px 24px",
              textAlign: "center",
              border: "1px solid #E2E8F0",
            }}
          >
            <Calendar size={48} color="#94A3B8" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F2942" }}>
              Tidak ada event pada kategori atau filter ini
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>
              Silakan ganti kata kunci atau pilih tab status lainnya.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "28px",
            }}
          >
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 18px rgba(15, 35, 60, 0.04)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                className="event-card-container"
              >
                {/* Poster Box with Floating Overlays */}
                <div style={{ position: "relative", height: "190px", width: "100%", overflow: "hidden" }}>
                  <img
                    src={evt.posterUrl}
                    alt={evt.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Category Pill Overlaid Top Left */}
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      padding: "5px 14px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "#1E293B",
                      fontSize: "12px",
                      fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {evt.category}
                  </span>

                  {/* Status Pill Overlaid Top Right */}
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      padding: "5px 14px",
                      borderRadius: "999px",
                      backgroundColor:
                        evt.status === "ongoing"
                          ? "rgba(220, 252, 231, 0.95)"
                          : evt.status === "upcoming"
                          ? "rgba(224, 242, 254, 0.95)"
                          : "rgba(241, 245, 249, 0.95)",
                      color:
                        evt.status === "ongoing"
                          ? "#15803D"
                          : evt.status === "upcoming"
                          ? "#0284C7"
                          : "#64748B",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {evt.status === "ongoing" && <Radio size={12} />}
                    {evt.status === "ongoing"
                      ? "Sedang Berlangsung"
                      : evt.status === "upcoming"
                      ? "Akan Datang"
                      : "Sudah Selesai"}
                  </span>
                </div>

                {/* Card Body matching Screen 3 */}
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <h2
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "#0F2942",
                        marginBottom: "12px",
                        lineHeight: 1.35,
                      }}
                    >
                      {evt.title}
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#64748B", marginBottom: "18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={15} color="#1D77F2" />
                        <span>{evt.dateDisplay || evt.date}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <MapPin size={15} color="#1D77F2" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Button */}
                  <Link
                    to={`/events/${evt.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "11px 20px",
                      borderRadius: "999px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: "#FFFFFF",
                      color: "#1D77F2",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    className="card-detail-btn"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
