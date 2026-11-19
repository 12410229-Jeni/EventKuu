import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Ticket as TicketIcon,
  Bell,
  User as UserIcon,
  LogOut,
  Clock,
  MapPin,
  Sparkles,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  Edit2,
  Save,
  Tag,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { getUserRegistrations, DEFAULT_INITIAL_EVENTS } from "../services/eventService";
import { getUserTickets } from "../services/ticketService";
import { getPublishedAnnouncements } from "../services/announcementService";
import { updateUserProfile } from "../services/userService";
import type { Registration, Ticket, Announcement, Event } from "../types";

export default function UserDashboardPage() {
  const { currentUser, userProfile, logout, refreshUserProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Tab active: overview, registrations, tickets, announcements, profile
  const [activeTab, setActiveTab] = useState<string>(tabParam || "overview");
  const [ticketFilter, setTicketFilter] = useState<"active" | "used" | "cancelled">("active");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [profileName, setProfileName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Sync tab with URL query parameter
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!currentUser) return;
        const uid = currentUser.uid;
        const [regData, tktData, annData] = await Promise.all([
          getUserRegistrations(uid),
          getUserTickets(uid),
          getPublishedAnnouncements(),
        ]);
        setRegistrations(regData);
        setTickets(tktData);
        setAnnouncements(annData);

        // Profile init dari profil Firebase / Firestore riil
        setProfileName(userProfile?.fullName || currentUser?.displayName || "");
        setStudentId(userProfile?.studentId || "");
        setFaculty(userProfile?.faculty || "");
        setPhone(userProfile?.phone || "");
      } catch (err) {
        console.error("Gagal load user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, userProfile]);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await updateUserProfile(currentUser.uid, {
        fullName: profileName.trim(),
        studentId: studentId.trim(),
        faculty: faculty.trim(),
        phone: phone.trim(),
      });
      await refreshUserProfile();
      setIsEditingProfile(false);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
      alert("Gagal menyimpan profil ke database.");
    }
  };

  // Filter tiket sesuai status
  const activeTickets = tickets.filter((t) => t.status === "active");
  const usedTickets = tickets.filter((t) => t.status === "used");
  const cancelledTickets = tickets.filter((t) => t.status === "cancelled");

  const displayedTickets =
    ticketFilter === "active"
      ? activeTickets
      : ticketFilter === "used"
      ? usedTickets
      : cancelledTickets;

  const upcomingEvents = DEFAULT_INITIAL_EVENTS.filter((e) => e.status !== "completed").slice(0, 3);

  const studentName =
    userProfile?.fullName ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "Mahasiswa";

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar matching UI Reference */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px 24px",
            textDecoration: "none",
            borderBottom: "1px solid #F1F5F9",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "#1D77F2",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TicketIcon size={20} />
          </div>
          <span style={{ fontSize: "19px", fontWeight: 800, color: "#0F2942" }}>EventKu</span>
        </Link>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          <button
            type="button"
            onClick={() => switchTab("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "overview" ? "#EFF6FF" : "transparent",
              color: activeTab === "overview" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "overview" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <LayoutDashboard size={18} />
            <span>Beranda</span>
          </button>

          <Link
            to="/events"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              color: "#64748B",
              fontWeight: 500,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            <CalendarDays size={18} />
            <span>Event Kampus</span>
          </Link>

          <button
            type="button"
            onClick={() => switchTab("registrations")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "registrations" ? "#EFF6FF" : "transparent",
              color: activeTab === "registrations" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "registrations" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <CalendarCheck size={18} />
            <span>Pendaftaran Saya</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab("tickets")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "tickets" ? "#EFF6FF" : "transparent",
              color: activeTab === "tickets" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "tickets" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <TicketIcon size={18} />
            <span>E-Ticket</span>
          </button>

          <Link
            to="/announcements"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              color: "#64748B",
              fontWeight: 500,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            <Bell size={18} />
            <span>Pengumuman</span>
          </Link>

          <button
            type="button"
            onClick={() => switchTab("profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "profile" ? "#EFF6FF" : "transparent",
              color: activeTab === "profile" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "profile" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <UserIcon size={18} />
            <span>Profil</span>
          </button>
        </nav>

        {/* Logout Bottom */}
        <div style={{ paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
          <button
            type="button"
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              width: "100%",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "transparent",
              color: "#EF4444",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        
        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD (Matches Screen 7 UI)                    */}
        {/* =================================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F2942" }}>
                Halo, {studentName}! 👋
              </h1>
              <p style={{ fontSize: "14.5px", color: "#64748B", marginTop: "4px" }}>
                Temukan event menarik, daftar, dan kelola tiketmu di EventKu.
              </p>
            </div>

            {/* Statistics Cards Pill Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginBottom: "32px",
              }}
            >
              {/* Event Tersedia */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px 24px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                }}
              >
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
                  <CalendarDays size={22} />
                </div>
                <div>
                  <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>Event Tersedia</span>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F2942" }}>12</div>
                </div>
              </div>

              {/* Tiket Aktif */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px 24px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
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
                  }}
                >
                  <TicketIcon size={22} />
                </div>
                <div>
                  <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>Tiket Aktif</span>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F2942" }}>
                    {activeTickets.length || 1}
                  </div>
                </div>
              </div>

              {/* Event Diikuti */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px 24px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
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
                  }}
                >
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>Event Diikuti</span>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F2942" }}>
                    {registrations.length || 3}
                  </div>
                </div>
              </div>
            </div>

            {/* Split Grid: Upcoming Events (Left) & Active Ticket + Announcements (Right) */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "28px" }}>
              {/* Left: Event Mendatang */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F2942" }}>Event Mendatang</h2>
                  <Link
                    to="/events"
                    style={{ fontSize: "12.5px", fontWeight: 600, color: "#1D77F2", textDecoration: "none" }}
                  >
                    Lihat Semua →
                  </Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {upcomingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "12px",
                        borderRadius: "16px",
                        border: "1px solid #F1F5F9",
                        backgroundColor: "#FAFCFF",
                      }}
                    >
                      <img
                        src={evt.posterUrl}
                        alt={evt.title}
                        style={{
                          width: "80px",
                          height: "60px",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            backgroundColor: "#DBEAFE",
                            color: "#1D77F2",
                          }}
                        >
                          {evt.category}
                        </span>
                        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F2942", margin: "4px 0" }}>
                          {evt.title}
                        </h3>
                        <div style={{ display: "flex", gap: "12px", fontSize: "11.5px", color: "#64748B" }}>
                          <span>📅 {evt.dateDisplay || evt.date}</span>
                          <span>📍 {evt.location}</span>
                        </div>
                      </div>
                      <Link
                        to={`/events/${evt.id}`}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "999px",
                          backgroundColor: "#1D77F2",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Lihat Event
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: E-Ticket Aktif + Pengumuman Terbaru */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* E-Ticket Aktif Card */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "24px",
                    padding: "24px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <TicketIcon size={18} color="#1D77F2" />
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942" }}>E-Ticket Aktif</h2>
                  </div>

                  {activeTickets.length > 0 ? (
                    <div
                      onClick={() => switchTab("tickets")}
                      style={{
                        borderRadius: "16px",
                        border: "1px solid #BFDBFE",
                        backgroundColor: "#EFF6FF",
                        padding: "16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <img
                        src={activeTickets[0].eventPoster || "/assets/posters/techfest-poster.jpg"}
                        alt={activeTickets[0].eventTitle}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "12px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F2942" }}>
                          {activeTickets[0].eventTitle}
                        </h4>
                        <span style={{ fontSize: "12px", color: "#1D77F2", fontWeight: 600 }}>
                          📅 {activeTickets[0].eventDate}
                        </span>
                        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                          {activeTickets[0].ticketCode}
                        </div>
                      </div>
                      <ArrowRight size={16} color="#1D77F2" />
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "#64748B" }}>Belum ada tiket aktif saat ini.</p>
                  )}
                </div>

                {/* Pengumuman Terbaru */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "24px",
                    padding: "24px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Bell size={18} color="#1D77F2" />
                      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942" }}>Pengumuman Terbaru</h2>
                    </div>
                    <Link
                      to="/announcements"
                      style={{ fontSize: "12px", fontWeight: 600, color: "#1D77F2", textDecoration: "none" }}
                    >
                      Lihat Semua →
                    </Link>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {announcements.slice(0, 3).map((a) => (
                      <Link
                        key={a.id}
                        to={`/announcements/${a.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "12px",
                          backgroundColor: "#F8FAFC",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <div style={{ flex: 1, paddingRight: "10px" }}>
                          <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#0F2942" }}>{a.title}</h4>
                          <span style={{ fontSize: "11px", color: "#64748B" }}>{String(a.publishedAt || a.createdAt || "Hari ini")}</span>
                        </div>
                        <ArrowRight size={14} color="#64748B" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: MY REGISTRATIONS (PAGE 12)                                  */}
        {/* =================================================================== */}
        {activeTab === "registrations" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>
                Pendaftaran Saya
              </h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Daftar seluruh kegiatan kampus yang telah kamu daftarkan di EventKu.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px",
                    padding: "20px 24px",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <img
                      src={reg.eventPoster || "/assets/posters/techfest-poster.jpg"}
                      alt={reg.eventTitle}
                      style={{
                        width: "90px",
                        height: "70px",
                        borderRadius: "12px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942", marginBottom: "4px" }}>
                        {reg.eventTitle}
                      </h3>
                      <div style={{ display: "flex", gap: "16px", fontSize: "12.5px", color: "#64748B" }}>
                        <span>📅 {reg.eventDate}</span>
                        <span>🕒 {reg.eventTime}</span>
                        <span>📍 {reg.eventLocation}</span>
                      </div>
                      <div style={{ marginTop: "6px" }}>
                        <code style={{ fontSize: "11.5px", color: "#1D77F2", fontWeight: 700 }}>
                          {reg.ticketCode}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor: reg.status === "attended" ? "#DCFCE7" : "#EFF6FF",
                        color: reg.status === "attended" ? "#16A34A" : "#1D77F2",
                      }}
                    >
                      {reg.status === "attended" ? "Hadir" : "Terdaftar"}
                    </span>
                    <Link
                      to={`/events/${reg.eventId}`}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "999px",
                        border: "1px solid #CBD5E1",
                        backgroundColor: "#FFFFFF",
                        color: "#475569",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Detail Event
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: MY E-TICKETS (PAGE 13 - Matches Screen 8 UI Exactly)        */}
        {/* =================================================================== */}
        {activeTab === "tickets" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <TicketIcon size={24} color="#1D77F2" />
                <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>
                  E-Ticket Saya
                </h1>
              </div>
              <p style={{ fontSize: "14px", color: "#64748B" }}>
                Tiket untuk event yang sudah kamu daftarkan.
              </p>
            </div>

            {/* Filter Tabs matching Screen 8: Aktif (1) | Selesai (1) | Dibatalkan (0) */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
              <button
                type="button"
                onClick={() => setTicketFilter("active")}
                style={{
                  padding: "8px 24px",
                  borderRadius: "999px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: ticketFilter === "active" ? "#1D77F2" : "#FFFFFF",
                  color: ticketFilter === "active" ? "#FFFFFF" : "#64748B",
                  boxShadow: ticketFilter === "active" ? "0 4px 12px rgba(29, 119, 242, 0.25)" : "none",
                }}
              >
                Aktif ({activeTickets.length})
              </button>

              <button
                type="button"
                onClick={() => setTicketFilter("used")}
                style={{
                  padding: "8px 24px",
                  borderRadius: "999px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: ticketFilter === "used" ? "#1D77F2" : "#FFFFFF",
                  color: ticketFilter === "used" ? "#FFFFFF" : "#64748B",
                }}
              >
                Selesai ({usedTickets.length})
              </button>

              <button
                type="button"
                onClick={() => setTicketFilter("cancelled")}
                style={{
                  padding: "8px 24px",
                  borderRadius: "999px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: ticketFilter === "cancelled" ? "#1D77F2" : "#FFFFFF",
                  color: ticketFilter === "cancelled" ? "#FFFFFF" : "#64748B",
                }}
              >
                Dibatalkan ({cancelledTickets.length})
              </button>
            </div>

            {/* Tickets Grid / List */}
            {displayedTickets.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "60px 24px",
                  textAlign: "center",
                  border: "1px solid #E2E8F0",
                }}
              >
                <TicketIcon size={48} color="#94A3B8" style={{ margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942" }}>
                  Tidak ada tiket dengan status ini
                </h3>
                <p style={{ fontSize: "13.5px", color: "#64748B", marginTop: "4px" }}>
                  Temukan event menarik lainnya di halaman Event Kampus.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {displayedTickets.map((tkt) => (
                  <div key={tkt.id}>
                    {/* Perforated Ticket Card matching UI Screen 8 */}
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "24px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 6px 24px rgba(15, 35, 60, 0.05)",
                        display: "flex",
                        alignItems: "stretch",
                        overflow: "hidden",
                      }}
                    >
                      {/* Left side: Poster & Event Details */}
                      <div
                        style={{
                          flex: 1,
                          padding: "24px 28px",
                          display: "flex",
                          alignItems: "center",
                          gap: "24px",
                        }}
                      >
                        <img
                          src={tkt.eventPoster || "/assets/posters/techfest-poster.jpg"}
                          alt={tkt.eventTitle}
                          style={{
                            width: "160px",
                            height: "110px",
                            borderRadius: "16px",
                            objectFit: "cover",
                          }}
                        />

                        <div>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "3px 12px",
                              borderRadius: "999px",
                              backgroundColor: "#DBEAFE",
                              color: "#1D77F2",
                              marginBottom: "6px",
                            }}
                          >
                            {tkt.eventCategory || "Konser"}
                          </span>

                          <h3
                            style={{
                              fontSize: "19px",
                              fontWeight: 800,
                              color: "#0F2942",
                              marginBottom: "8px",
                            }}
                          >
                            {tkt.eventTitle}
                          </h3>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              fontSize: "13px",
                              color: "#64748B",
                            }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <CalendarDays size={14} color="#1D77F2" /> {tkt.eventDate}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Clock size={14} color="#1D77F2" /> {tkt.eventTime}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <MapPin size={14} color="#1D77F2" /> {tkt.eventLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Perforated divider line with top and bottom semicircles */}
                      <div
                        style={{
                          position: "relative",
                          width: "1px",
                          borderLeft: "2px dashed #E2E8F0",
                          margin: "12px 0",
                        }}
                      >
                        {/* Top cut-out */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-24px",
                            left: "-12px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#F4F8FC",
                            border: "1px solid #E2E8F0",
                          }}
                        ></div>
                        {/* Bottom cut-out */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-24px",
                            left: "-12px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#F4F8FC",
                            border: "1px solid #E2E8F0",
                          }}
                        ></div>
                      </div>

                      {/* Right side: QR Code & Code pill */}
                      <div
                        style={{
                          width: "210px",
                          padding: "24px 20px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#FFFFFF",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px",
                            borderRadius: "14px",
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                            marginBottom: "10px",
                          }}
                        >
                          <QRCodeSVG
                            value={tkt.qrCodeData || tkt.ticketCode}
                            size={100}
                            level="M"
                          />
                        </div>

                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "999px",
                            backgroundColor: "#EFF6FF",
                            color: "#1D77F2",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {tkt.ticketCode}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons matching Screen 8: Unduh Tiket & Lihat Detail */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => window.print()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 22px",
                          borderRadius: "999px",
                          border: "1px solid #CBD5E1",
                          backgroundColor: "#FFFFFF",
                          color: "#1E293B",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <Download size={15} /> Unduh Tiket
                      </button>

                      <Link
                        to={`/events/${tkt.eventId}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 24px",
                          borderRadius: "999px",
                          backgroundColor: "#1D77F2",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          fontWeight: 700,
                          textDecoration: "none",
                          boxShadow: "0 4px 12px rgba(29, 119, 242, 0.25)",
                        }}
                      >
                        <Eye size={15} /> Lihat Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: PROFILE (PAGE 14)                                           */}
        {/* =================================================================== */}
        {activeTab === "profile" && (
          <div style={{ maxWidth: "680px" }}>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>
                Profil Mahasiswa
              </h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Kelola informasi akun dan identitas akademikmu di EventKu.
              </p>
            </div>

            {profileSaveSuccess && (
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
                <span>Perubahan profil berhasil disimpan!</span>
              </div>
            )}

            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "36px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
              }}
            >
              {/* Avatar Row */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    backgroundColor: "#DBEAFE",
                    color: "#1D77F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    fontWeight: 800,
                  }}
                >
                  {profileName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F2942" }}>{profileName}</h3>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>{currentUser?.email}</span>
                  <div style={{ marginTop: "4px" }}>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: "#DCFCE7",
                        color: "#16A34A",
                      }}
                    >
                      Role: Mahasiswa Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: isEditingProfile ? "#FFFFFF" : "#F8FAFC",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                    Nomor Induk Mahasiswa (NIM)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: isEditingProfile ? "#FFFFFF" : "#F8FAFC",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                    Fakultas / Program Studi
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: isEditingProfile ? "#FFFFFF" : "#F8FAFC",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                    Nomor WhatsApp / Kontak
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: isEditingProfile ? "#FFFFFF" : "#F8FAFC",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  {isEditingProfile ? (
                    <>
                      <button
                        type="submit"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px 24px",
                          borderRadius: "999px",
                          backgroundColor: "#1D77F2",
                          color: "#FFFFFF",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <Save size={16} /> Simpan Perubahan
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        style={{
                          padding: "12px 20px",
                          borderRadius: "999px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #CBD5E1",
                          color: "#475569",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 24px",
                        borderRadius: "999px",
                        backgroundColor: "#1D77F2",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <Edit2 size={16} /> Edit Profil
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
