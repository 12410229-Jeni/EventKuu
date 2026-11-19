import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Flame,
  Calendar,
  MapPin,
  ArrowRight,
  Activity,
  Music,
  CalendarDays,
  Trophy,
  Code,
  Laptop,
  Gamepad2,
  Mic2,
} from "lucide-react";
import { getEvents } from "../services/eventService";
import type { Event, EventCategory } from "../types";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<EventCategory | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Gagal mengambil events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 8 Kategori Wajib Sesuai Ketentuan Dosen & Screenshot Referensi UI
  const categoriesConfig = [
    {
      name: "Sport" as EventCategory,
      count: "12 Event",
      icon: Activity,
    },
    {
      name: "Festival" as EventCategory,
      count: "8 Event",
      icon: Music,
    },
    {
      name: "Campus & Faculty Day" as EventCategory,
      count: "Event Tahunan",
      badge: "Event Tahunan",
      icon: CalendarDays,
    },
    {
      name: "Competition" as EventCategory,
      count: "15 Event",
      icon: Trophy,
    },
    {
      name: "Workshop" as EventCategory,
      count: "18 Event",
      icon: Code,
    },
    {
      name: "Teknologi" as EventCategory,
      count: "20 Event",
      icon: Laptop,
    },
    {
      name: "Game" as EventCategory,
      count: "10 Event",
      icon: Gamepad2,
    },
    {
      name: "Konser" as EventCategory,
      count: "7 Event",
      icon: Mic2,
    },
  ];

  const handleCategoryClick = (catName: EventCategory) => {
    if (selectedCat === catName) {
      setSelectedCat(null);
    } else {
      setSelectedCat(catName);
    }
  };

  const displayedEvents = useMemo(() => {
    if (selectedCat) {
      return events.filter((e) => e.category === selectedCat);
    }
    // Default 3 popular events matching screenshot
    return events.slice(0, 3);
  }, [events, selectedCat]);

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Wave Header matching UI Reference Screen 10 */}
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
            Kategori Event
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, marginBottom: "32px" }}>
            Jelajahi berbagai kategori kegiatan kampus dan temukan event yang sesuai dengan minatmu.
          </p>

          {/* 8 Categories Pills Grid matching UI Reference Screen 10 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "16px",
            }}
          >
            {categoriesConfig.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCat === cat.name;

              return (
                <div
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  style={{
                    backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                    borderRadius: "18px",
                    padding: "16px 20px",
                    border: isSelected ? "2px solid #1D77F2" : "1px solid #E2E8F0",
                    boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  className="category-pill-card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        backgroundColor: isSelected ? "#DBEAFE" : "#F0F6FD",
                        color: "#1D77F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconComp size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "14.5px", fontWeight: 700, color: "#0F2942" }}>
                        {cat.name}
                      </h3>
                      {cat.badge ? (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            backgroundColor: "#DBEAFE",
                            color: "#1D77F2",
                          }}
                        >
                          {cat.badge}
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#64748B" }}>{cat.count}</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Below matching UI Reference Screen 10 */}
      <section style={{ maxWidth: "1220px", margin: "40px auto 0", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Flame size={20} color="#EA580C" />
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F2942" }}>
              {selectedCat ? `Event Kategori: ${selectedCat}` : "Event Populer di Semua Kategori"}
            </h2>
          </div>

          <Link
            to="/events"
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#1D77F2",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Lihat Semua Event →
          </Link>
        </div>

        {/* Event Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "28px",
          }}
        >
          {displayedEvents.map((evt) => (
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
                transition: "transform 0.2s ease",
              }}
              className="event-card-container"
            >
              {/* Poster with Overlaid Tag */}
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
                  }}
                >
                  {evt.category}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#0F2942",
                      marginBottom: "12px",
                      lineHeight: 1.35,
                    }}
                  >
                    {evt.title}
                  </h3>

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
                  }}
                  className="card-detail-btn"
                >
                  Lihat Detail →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
