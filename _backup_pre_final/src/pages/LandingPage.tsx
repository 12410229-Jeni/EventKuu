import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Ticket,
  Sparkles,
  Calendar,
  Radio,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import { getActiveEvents } from "../services/eventService";
import type { Event } from "../types";

export default function LandingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getActiveEvents();
        setEvents(data);
      } catch (error) {
        console.error("Gagal mengambil event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const featuredEvents = events.slice(0, 3);

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Hero Section matching Screenshot media_1794806970000_2850c653.jpg */}
      <section
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #DDEBFA 0%, #EDF4FD 60%, #F4F8FC 100%)",
          padding: "70px 24px 80px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1220px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
          className="hero-grid-container"
        >
          {/* Left Column: Headlines & Call to Actions */}
          <div>
            {/* Small Badge: Campus Event Platform */}
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
                marginBottom: "20px",
                boxShadow: "0 2px 10px rgba(15, 35, 60, 0.06)",
              }}
            >
              <Calendar size={14} color="#1D77F2" />
              <span>Campus Event Platform</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: "44px",
                fontWeight: 900,
                color: "#0F2942",
                lineHeight: 1.18,
                letterSpacing: "-1px",
                marginBottom: "20px",
              }}
            >
              Discover Events.
              <br />
              <span style={{ color: "#1D77F2" }}>Connect with Campus.</span>
            </h1>

            {/* Short Description */}
            <p
              style={{
                fontSize: "16px",
                color: "#475569",
                lineHeight: 1.65,
                maxWidth: "520px",
                marginBottom: "36px",
              }}
            >
              Temukan, daftar, dan ikuti berbagai kegiatan kampus seperti seminar,
              workshop, kompetisi, dan festival dalam satu platform, EventKu.
            </p>

            {/* Buttons: Explore Events & Join Now */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <Link
                to="/events"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  borderRadius: "999px",
                  backgroundColor: "#1D77F2",
                  color: "#FFFFFF",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(29, 119, 242, 0.35)",
                  transition: "transform 0.2s ease",
                }}
              >
                Explore Events <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "14px 32px",
                  borderRadius: "999px",
                  backgroundColor: "#FFFFFF",
                  color: "#0F2942",
                  border: "1px solid #CBD5E1",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                Join Now
              </Link>
            </div>
          </div>

          {/* Right Column: High-Res Students Photograph */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(15, 35, 60, 0.12)",
                border: "3px solid #FFFFFF",
                position: "relative",
              }}
            >
              <img
                src="/hero-students.jpg"
                alt="Mahasiswa EventKu dengan Laptop di Tangga Kampus"
                style={{
                  width: "100%",
                  height: "440px",
                  objectFit: "cover",
                  objectPosition: "center 25%",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ maxWidth: "1220px", margin: "40px auto 0", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "#1D77F2",
              }}
            >
              KEGIATAN PILIHAN
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942", marginTop: "2px" }}>
              Event Unggulan Kampus
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
            Lihat Semua Event <ChevronRight size={16} />
          </Link>
        </div>

        {/* 3 Featured Cards Grid matching Explore Screen Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "28px",
          }}
        >
          {featuredEvents.map((evt) => (
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
              }}
              className="event-card-container"
            >
              <div style={{ position: "relative", height: "190px", width: "100%", overflow: "hidden" }}>
                <img
                  src={evt.posterUrl}
                  alt={evt.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    padding: "5px 14px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(220, 252, 231, 0.95)",
                    color: "#15803D",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Radio size={12} /> Sedang Berlangsung
                </span>
              </div>

              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F2942", marginBottom: "12px" }}>
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

      {/* 8 Categories Quick Strip */}
      <section style={{ maxWidth: "1220px", margin: "60px auto 0", padding: "0 24px" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "28px",
            padding: "36px 40px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 24px rgba(15, 35, 60, 0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F2942" }}>
              Kategori Kegiatan Kampus
            </h2>
            <Link to="/categories" style={{ fontSize: "13px", fontWeight: 700, color: "#1D77F2", textDecoration: "none" }}>
              Jelajahi 8 Kategori →
            </Link>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["Sport", "Festival", "Campus & Faculty Day", "Competition", "Workshop", "Teknologi", "Game", "Konser"].map((cat) => (
              <Link
                key={cat}
                to={`/events?category=${encodeURIComponent(cat)}`}
                style={{
                  padding: "10px 22px",
                  borderRadius: "999px",
                  backgroundColor: "#F4F8FC",
                  color: "#0F2942",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid #E2E8F0",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
