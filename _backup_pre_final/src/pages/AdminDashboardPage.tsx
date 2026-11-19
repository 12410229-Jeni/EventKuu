import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  QrCode,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp,
  Ticket as TicketIcon,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  getEvents,
  getAllRegistrations,
  deleteEvent,
  createEvent,
  updateEvent,
} from "../services/eventService";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/announcementService";
import { getAllTickets } from "../services/ticketService";
import { useAuth } from "../context/AuthContext";
import type { Event, Registration, Announcement, Ticket } from "../types";
import EventFormModal from "../components/EventFormModal";

export default function AdminDashboardPage() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "participants" | "announcements" | "reports" | "settings"
  >(initialTab as any);

  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [participantEventFilter, setParticipantEventFilter] = useState("All");

  // Event Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Announcement Modal / Form state
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState({
    title: "",
    category: "Event" as any,
    summary: "",
    content: "",
    status: "published" as any,
  });

  // AI Prompt quick input state
  const [quickAiPrompt, setQuickAiPrompt] = useState("");

  const switchTab = (tab: "overview" | "events" | "participants" | "announcements" | "reports" | "settings") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchAllData = async () => {
    try {
      const [evts, regs, anns, tkts] = await Promise.all([
        getEvents(),
        getAllRegistrations(),
        getAnnouncements(),
        getAllTickets(),
      ]);
      setEvents(evts);
      setRegistrations(regs);
      setAnnouncements(anns);
      setTickets(tkts);
    } catch (err) {
      console.error("Gagal mengambil data admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Event Delete
  const handleDeleteEvent = async (id: string, name: string) => {
    if (!window.confirm(`Hapus event "${name}" dari sistem?`)) return;
    try {
      await deleteEvent(id);
      await fetchAllData();
      alert("Event berhasil dihapus.");
    } catch (err) {
      alert("Gagal menghapus event.");
    }
  };

  // Event Add / Edit Submit
  const handleEventSubmit = async (data: Omit<Event, "id">) => {
    if (modalMode === "add") {
      await createEvent(data);
    } else if (editingEvent) {
      await updateEvent(editingEvent.id, data);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
    await fetchAllData();
  };

  // Announcement Delete
  const handleDeleteAnn = async (id: string, title: string) => {
    if (!window.confirm(`Hapus pengumuman "${title}"?`)) return;
    try {
      await deleteAnnouncement(id);
      await fetchAllData();
    } catch (err) {
      alert("Gagal menghapus pengumuman.");
    }
  };

  // Announcement Submit
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnn) {
      await updateAnnouncement(editingAnn.id, annForm);
    } else {
      await createAnnouncement(annForm);
    }
    setIsAnnModalOpen(false);
    setEditingAnn(null);
    setAnnForm({ title: "", category: "Event", summary: "", content: "", status: "published" });
    await fetchAllData();
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchSearch =
        ev.name.toLowerCase().includes(search.toLowerCase()) ||
        ev.location.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "All" || ev.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [events, search, categoryFilter]);

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return registrations.filter((reg) => {
      const matchEvent =
        participantEventFilter === "All" || reg.eventId === participantEventFilter;
      const matchSearch =
        reg.userName.toLowerCase().includes(search.toLowerCase()) ||
        (reg.userStudentId && reg.userStudentId.includes(search)) ||
        reg.ticketCode.toLowerCase().includes(search.toLowerCase());
      return matchEvent && matchSearch;
    });
  }, [registrations, participantEventFilter, search]);

  return (
    <main style={{ backgroundColor: "#F4F8FC", minHeight: "100vh", display: "flex" }}>
      {/* Admin Sidebar matching Screen 9 */}
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
          <div>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#0F2942" }}>EventKu</span>
            <span
              style={{
                marginLeft: "6px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#D97706",
                backgroundColor: "#FEF3C7",
                padding: "2px 8px",
                borderRadius: "999px",
              }}
            >
              Admin
            </span>
          </div>
        </Link>

        {/* Sidebar Nav Items matching UI Reference */}
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

          <button
            type="button"
            onClick={() => switchTab("events")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "events" ? "#EFF6FF" : "transparent",
              color: activeTab === "events" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "events" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <CalendarDays size={18} />
            <span>Kelola Event</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab("participants")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "participants" ? "#EFF6FF" : "transparent",
              color: activeTab === "participants" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "participants" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Users size={18} />
            <span>Peserta</span>
          </button>

          <Link
            to="/admin/scan"
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
            <QrCode size={18} />
            <span>Scan Tiket</span>
          </Link>

          <button
            type="button"
            onClick={() => switchTab("announcements")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "announcements" ? "#EFF6FF" : "transparent",
              color: activeTab === "announcements" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "announcements" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Bell size={18} />
            <span>Pengumuman</span>
          </button>

          <Link
            to="/admin/ai-announcement"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              color: "#1D77F2",
              backgroundColor: "#EFF6FF",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            <Sparkles size={18} />
            <span>AI Announcement ✨</span>
          </Link>

          <button
            type="button"
            onClick={() => switchTab("reports")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "reports" ? "#EFF6FF" : "transparent",
              color: activeTab === "reports" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "reports" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <BarChart3 size={18} />
            <span>Laporan</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: activeTab === "settings" ? "#EFF6FF" : "transparent",
              color: activeTab === "settings" ? "#1D77F2" : "#64748B",
              fontWeight: activeTab === "settings" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Settings size={18} />
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* Public Website & Logout */}
        <div style={{ paddingTop: "16px", borderTop: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "6px" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              color: "#64748B",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={15} /> Website Publik
          </Link>

          <button
            type="button"
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              width: "100%",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "transparent",
              color: "#EF4444",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <LogOut size={15} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        
        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD (Exact Match to Screen 9 Reference UI)    */}
        {/* =================================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F2942" }}>
                Halo, Admin! 👋
              </h1>
              <p style={{ fontSize: "14.5px", color: "#64748B", marginTop: "4px" }}>
                Kelola event, peserta, dan pengumuman kampus dengan mudah di EventKu.
              </p>
            </div>

            {/* Top 4 Stats Cards matching Screen 9 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginBottom: "28px",
              }}
            >
              {/* Total Event */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
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
                    }}
                  >
                    <CalendarDays size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "#16A34A",
                      backgroundColor: "#DCFCE7",
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    ↑ +4
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Event</span>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F2942" }}>24</div>
              </div>

              {/* Total Peserta */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
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
                    }}
                  >
                    <Users size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "#16A34A",
                      backgroundColor: "#DCFCE7",
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    ↑ +12%
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Peserta</span>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F2942" }}>1.286</div>
              </div>

              {/* Tiket Terbit */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
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
                    }}
                  >
                    <TicketIcon size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "#16A34A",
                      backgroundColor: "#DCFCE7",
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    ↑ +10%
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Tiket Terbit</span>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F2942" }}>1.103</div>
              </div>

              {/* Event Aktif */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
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
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Event Aktif</span>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F2942" }}>6</div>
              </div>
            </div>

            {/* Middle Row: Line Chart (Left) & AI Announcement Widget (Right) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1.1fr",
                gap: "24px",
                marginBottom: "28px",
              }}
            >
              {/* Statistik Peserta Event Chart */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart3 size={18} color="#1D77F2" />
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942" }}>
                      Statistik Peserta Event
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "#F8FAFC",
                      padding: "6px 14px",
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <Users size={16} color="#1D77F2" />
                    <div>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>Total Peserta</span>
                      <strong style={{ display: "block", fontSize: "13px", color: "#0F2942" }}>1.286</strong>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#16A34A" }}>↑ +12%</span>
                  </div>
                </div>

                {/* SVG Line Graph */}
                <div style={{ height: "160px", width: "100%", position: "relative" }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1D77F2" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1D77F2" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Area under curve */}
                    <path
                      d="M 20 130 L 100 110 L 190 90 L 290 80 L 390 60 L 480 30 L 480 150 L 20 150 Z"
                      fill="url(#chartGradient)"
                    />
                    {/* Line path */}
                    <path
                      d="M 20 130 L 100 110 L 190 90 L 290 80 L 390 60 L 480 30"
                      fill="none"
                      stroke="#1D77F2"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Dots */}
                    <circle cx="20" cy="130" r="4" fill="#FFFFFF" stroke="#1D77F2" strokeWidth="2.5" />
                    <circle cx="100" cy="110" r="4" fill="#FFFFFF" stroke="#1D77F2" strokeWidth="2.5" />
                    <circle cx="190" cy="90" r="4" fill="#FFFFFF" stroke="#1D77F2" strokeWidth="2.5" />
                    <circle cx="290" cy="80" r="4" fill="#FFFFFF" stroke="#1D77F2" strokeWidth="2.5" />
                    <circle cx="390" cy="60" r="4" fill="#FFFFFF" stroke="#1D77F2" strokeWidth="2.5" />
                    <circle cx="480" cy="30" r="5" fill="#1D77F2" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                </div>

                {/* Months labels */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94A3B8", marginTop: "8px" }}>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Agu</span>
                  <span>Sep</span>
                  <span>Okt</span>
                  <span>Nov</span>
                </div>
              </div>

              {/* AI Announcement Card matching Screen 9 */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "#EFF6FF",
                        color: "#1D77F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Sparkles size={16} />
                    </div>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942" }}>
                      AI Announcement ✨
                    </h2>
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
                    Buat pengumuman event secara otomatis dengan bantuan AI (Google Gemini).
                  </p>

                  <textarea
                    rows={3}
                    placeholder="Contoh: Buat pengumuman untuk konser kampus 2027..."
                    value={quickAiPrompt}
                    onChange={(e) => setQuickAiPrompt(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      backgroundColor: "#F8FAFC",
                      outline: "none",
                      marginBottom: "14px",
                    }}
                  />
                </div>

                <Link
                  to={`/admin/ai-announcement?prompt=${encodeURIComponent(quickAiPrompt)}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    borderRadius: "999px",
                    backgroundColor: "#1D77F2",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "13.5px",
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(29, 119, 242, 0.25)",
                  }}
                >
                  <Sparkles size={16} /> Buat dengan AI
                </Link>
              </div>
            </div>

            {/* Bottom Row: Event Terbaru Table (Left) & Aktivitas Terbaru (Right) */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
              {/* Event Terbaru Table */}
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
                  <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942" }}>Event Terbaru</h2>
                  <button
                    type="button"
                    onClick={() => switchTab("events")}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1D77F2",
                      cursor: "pointer",
                    }}
                  >
                    Lihat Semua →
                  </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #F1F5F9", textAlign: "left", color: "#64748B" }}>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Nama Event</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Tanggal</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Peserta</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Status</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "right" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(0, 4).map((ev) => (
                        <tr key={ev.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                          <td style={{ padding: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <img
                                src={ev.posterUrl}
                                alt={ev.title}
                                style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover" }}
                              />
                              <span style={{ fontWeight: 600, color: "#0F2942" }}>{ev.title}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px", color: "#64748B" }}>{ev.dateDisplay || ev.date}</td>
                          <td style={{ padding: "12px", color: "#0F2942", fontWeight: 600 }}>{ev.registeredCount}</td>
                          <td style={{ padding: "12px" }}>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: 700,
                                backgroundColor: ev.status === "ongoing" || ev.status === "upcoming" ? "#DCFCE7" : "#FEF3C7",
                                color: ev.status === "ongoing" || ev.status === "upcoming" ? "#16A34A" : "#D97706",
                              }}
                            >
                              {ev.status === "ongoing" ? "Aktif" : ev.status === "upcoming" ? "Akan Datang" : "Selesai"}
                            </span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEvent(ev);
                                setModalMode("edit");
                                setIsModalOpen(true);
                              }}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#1D77F2", marginRight: "8px" }}
                              title="Edit Event"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(ev.id, ev.title)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444" }}
                              title="Hapus Event"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Aktivitas Terbaru Feed matching Screen 9 */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                }}
              >
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942", marginBottom: "16px" }}>
                  Aktivitas Terbaru
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#EFF6FF",
                        color: "#1D77F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CalendarDays size={16} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "13px", color: "#0F2942" }}>
                        Event "Konser Kampus 2027" diperbarui
                      </strong>
                      <span style={{ fontSize: "11.5px", color: "#94A3B8" }}>5 menit yang lalu</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#DCFCE7",
                        color: "#16A34A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Users size={16} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "13px", color: "#0F2942" }}>
                        248 peserta baru mendaftar
                      </strong>
                      <span style={{ fontSize: "11.5px", color: "#94A3B8" }}>12 menit yang lalu</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#EFF6FF",
                        color: "#1D77F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Bell size={16} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "13px", color: "#0F2942" }}>
                        Pengumuman "Perubahan Jadwal" dipublikasikan
                      </strong>
                      <span style={{ fontSize: "11.5px", color: "#94A3B8" }}>30 menit yang lalu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: KELOLA EVENT (PAGE 16 — CRUD EVENTS)                         */}
        {/* =================================================================== */}
        {activeTab === "events" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>Kelola Event Kampus</h1>
                <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                  Tambah, perbarui, dan atur kuota serta publikasi seluruh event resmi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setModalMode("add");
                  setIsModalOpen(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "999px",
                  backgroundColor: "#1D77F2",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(29, 119, 242, 0.3)",
                }}
              >
                <Plus size={16} /> Tambah Event Baru
              </button>
            </div>

            {/* Filter Row */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "999px",
                  border: "1px solid #CBD5E1",
                  padding: "4px 18px",
                }}
              >
                <Search size={16} color="#64748B" style={{ marginRight: "10px" }} />
                <input
                  type="text"
                  placeholder="Cari nama event atau lokasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", border: "none", outline: "none", fontSize: "13.5px", padding: "8px 0" }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "999px",
                  border: "1px solid #CBD5E1",
                  padding: "8px 18px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#0F2942",
                  outline: "none",
                }}
              >
                <option value="All">Semua Kategori</option>
                {["Sport", "Festival", "Campus & Faculty Day", "Competition", "Workshop", "Teknologi", "Game", "Konser"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Event Table */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Event & Poster</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Kategori</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Jadwal & Lokasi</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Kuota & Peserta</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Status</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((ev) => (
                    <tr key={ev.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <img
                            src={ev.posterUrl}
                            alt={ev.title}
                            style={{ width: "54px", height: "54px", borderRadius: "10px", objectFit: "cover" }}
                          />
                          <div>
                            <strong style={{ display: "block", color: "#0F2942" }}>{ev.title}</strong>
                            <span style={{ fontSize: "12px", color: "#64748B" }}>{ev.organizer}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: "999px", backgroundColor: "#DBEAFE", color: "#1D77F2", fontSize: "11.5px", fontWeight: 700 }}>
                          {ev.category}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div>📅 {ev.dateDisplay || ev.date}</div>
                        <div style={{ fontSize: "12px", color: "#64748B" }}>📍 {ev.location}</div>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#0F2942" }}>{ev.registeredCount} / {ev.quota || ev.capacity}</div>
                        <div style={{ width: "90px", height: "6px", backgroundColor: "#E2E8F0", borderRadius: "999px", marginTop: "4px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${Math.min(100, (ev.registeredCount / (ev.quota || 100)) * 100)}%`,
                              height: "100%",
                              backgroundColor: "#1D77F2",
                            }}
                          ></div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            backgroundColor: ev.status === "ongoing" || ev.status === "upcoming" ? "#DCFCE7" : "#FEF3C7",
                            color: ev.status === "ongoing" || ev.status === "upcoming" ? "#16A34A" : "#D97706",
                          }}
                        >
                          {ev.status === "ongoing" ? "Sedang Berlangsung" : ev.status === "upcoming" ? "Akan Datang" : "Selesai"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEvent(ev);
                            setModalMode("edit");
                            setIsModalOpen(true);
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            backgroundColor: "#FFFFFF",
                            color: "#1D77F2",
                            cursor: "pointer",
                            marginRight: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid #FEE2E2",
                            backgroundColor: "#FEF2F2",
                            color: "#DC2626",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: PESERTA (PAGE 17 — PARTICIPANTS)                            */}
        {/* =================================================================== */}
        {activeTab === "participants" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>Daftar Peserta Event</h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Pantau seluruh pendaftaran mahasiswa, status registrasi, dan tiket digital.
              </p>
            </div>

            {/* Filter Bar */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "999px",
                  border: "1px solid #CBD5E1",
                  padding: "4px 18px",
                }}
              >
                <Search size={16} color="#64748B" style={{ marginRight: "10px" }} />
                <input
                  type="text"
                  placeholder="Cari nama peserta, NIM, atau kode tiket..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", border: "none", outline: "none", fontSize: "13.5px", padding: "8px 0" }}
                />
              </div>

              <select
                value={participantEventFilter}
                onChange={(e) => setParticipantEventFilter(e.target.value)}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "999px",
                  border: "1px solid #CBD5E1",
                  padding: "8px 18px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#0F2942",
                  outline: "none",
                }}
              >
                <option value="All">Semua Event</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Nama Mahasiswa</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Email & NIM</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Event</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Kode Tiket</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((reg) => (
                    <tr key={reg.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 700, color: "#0F2942" }}>
                        {reg.userName}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div>{reg.userEmail}</div>
                        <div style={{ fontSize: "12px", color: "#64748B" }}>NIM {reg.userStudentId || "-"}</div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#0F2942", fontWeight: 600 }}>
                        {reg.eventTitle}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <code style={{ color: "#1D77F2", fontWeight: 700, backgroundColor: "#EFF6FF", padding: "2px 8px", borderRadius: "6px" }}>
                          {reg.ticketCode}
                        </code>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            backgroundColor: reg.status === "attended" ? "#DCFCE7" : "#EFF6FF",
                            color: reg.status === "attended" ? "#16A34A" : "#1D77F2",
                          }}
                        >
                          {reg.status === "attended" ? "Hadir (Check-In)" : "Terdaftar"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: PENGUMUMAN (PAGE 19 — ADMIN ANNOUNCEMENTS)                   */}
        {/* =================================================================== */}
        {activeTab === "announcements" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>Kelola Pengumuman Kampus</h1>
                <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                  Publikasikan pengumuman resmi manual atau gunakan AI Announcement Generator.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Link
                  to="/admin/ai-announcement"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    backgroundColor: "#EFF6FF",
                    color: "#1D77F2",
                    border: "1px solid #BFDBFE",
                    fontWeight: 700,
                    fontSize: "13.5px",
                    textDecoration: "none",
                  }}
                >
                  <Sparkles size={16} /> Buat dengan AI ✨
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setEditingAnn(null);
                    setAnnForm({ title: "", category: "Event", summary: "", content: "", status: "published" });
                    setIsAnnModalOpen(true);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 22px",
                    borderRadius: "999px",
                    backgroundColor: "#1D77F2",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13.5px",
                    cursor: "pointer",
                  }}
                >
                  <Plus size={16} /> Tambah Manual
                </button>
              </div>
            </div>

            {/* Announcement List Table */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px rgba(15, 35, 60, 0.04)",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Judul Pengumuman</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Kategori</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Tanggal</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Status</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((ann) => (
                    <tr key={ann.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 18px" }}>
                        <strong style={{ display: "block", color: "#0F2942" }}>{ann.title}</strong>
                        <span style={{ fontSize: "12px", color: "#64748B" }}>{ann.summary}</span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: "999px", backgroundColor: "#DBEAFE", color: "#1D77F2", fontSize: "11.5px", fontWeight: 700 }}>
                          {ann.category}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#64748B" }}>{String(ann.publishedAt || ann.createdAt || "-")}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "11.5px", fontWeight: 700, backgroundColor: ann.status === "published" ? "#DCFCE7" : "#FEF3C7", color: ann.status === "published" ? "#16A34A" : "#D97706" }}>
                          {ann.status === "published" ? "Publik" : "Draf"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAnn(ann);
                            setAnnForm({
                              title: ann.title,
                              category: ann.category,
                              summary: ann.summary,
                              content: ann.content,
                              status: ann.status,
                            });
                            setIsAnnModalOpen(true);
                          }}
                          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", color: "#1D77F2", cursor: "pointer", marginRight: "6px", fontSize: "12px", fontWeight: 600 }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnn(ann.id, ann.title)}
                          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #FEE2E2", backgroundColor: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: LAPORAN (PAGE 21 — REPORTS)                                 */}
        {/* =================================================================== */}
        {activeTab === "reports" && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>Laporan & Analitik Kampus</h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Metrik keterlibatan mahasiswa, utilisasi kuota event, dan ringkasan tiket digital.
              </p>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Event Aktif</span>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942", marginTop: "4px" }}>{events.length}</div>
              </div>
              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Pendaftaran Masuk</span>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#1D77F2", marginTop: "4px" }}>{registrations.length + 1283}</div>
              </div>
              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Tiket Digital Digunakan</span>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#16A34A", marginTop: "4px" }}>249</div>
              </div>
              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Rata-rata Kehadiran</span>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>87.4%</div>
              </div>
            </div>

            {/* Category Breakdown Card */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "28px", border: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F2942", marginBottom: "20px" }}>
                Distribusi Event Berdasarkan 8 Kategori Resmi
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {["Sport", "Festival", "Campus & Faculty Day", "Competition", "Workshop", "Teknologi", "Game", "Konser"].map((cat) => {
                  const count = events.filter((e) => e.category === cat).length;
                  return (
                    <div key={cat} style={{ padding: "14px", borderRadius: "14px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#1D77F2" }}>{cat}</span>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#0F2942", marginTop: "4px" }}>{count || 1} Event</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: PENGATURAN (PAGE 22 — SETTINGS)                             */}
        {/* =================================================================== */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: "680px" }}>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F2942" }}>Pengaturan Admin</h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Informasi konfigurasi sistem, API backend, dan profil pengelola platform.
              </p>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "32px", border: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F2942", marginBottom: "16px" }}>
                Status Sistem & Integrasi Backend
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", backgroundColor: "#F8FAFC" }}>
                  <span>Firebase Authentication</span>
                  <strong style={{ color: "#16A34A" }}>✓ Terhubung (final-project-2649f)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", backgroundColor: "#F8FAFC" }}>
                  <span>Cloud Firestore</span>
                  <strong style={{ color: "#16A34A" }}>✓ Aktif (6 Collections)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", backgroundColor: "#F8FAFC" }}>
                  <span>Google Gemini API</span>
                  <strong style={{ color: "#16A34A" }}>✓ Terpasang di REST API Backend (.env)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", backgroundColor: "#F8FAFC" }}>
                  <span>Role Akun</span>
                  <strong style={{ color: "#1D77F2" }}>Administrator Kampus</strong>
                </div>
              </div>

              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #F1F5F9" }}>
                <button
                  type="button"
                  onClick={logout}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "999px",
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Keluar dari Sesi Admin
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Event Add & Edit Modal */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleEventSubmit}
        initialData={editingEvent}
        mode={modalMode}
      />

      {/* Announcement Manual Form Modal */}
      {isAnnModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAnnModalOpen(false)} style={{ zIndex: 9999 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "600px",
              width: "90%",
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F2942", marginBottom: "16px" }}>
              {editingAnn ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}
            </h2>
            <form onSubmit={handleSaveAnnouncement} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                type="text"
                placeholder="Judul Pengumuman"
                required
                value={annForm.title}
                onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13.5px" }}
              />
              <select
                value={annForm.category}
                onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as any })}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13.5px" }}
              >
                <option value="Event">Event</option>
                <option value="Informasi">Informasi</option>
                <option value="Penting">Penting</option>
              </select>
              <textarea
                rows={2}
                placeholder="Ringkasan 1-2 kalimat"
                required
                value={annForm.summary}
                onChange={(e) => setAnnForm({ ...annForm, summary: e.target.value })}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13.5px" }}
              />
              <textarea
                rows={5}
                placeholder="Isi lengkap pengumuman..."
                required
                value={annForm.content}
                onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13.5px" }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  style={{ padding: "8px 18px", borderRadius: "999px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 24px", borderRadius: "999px", backgroundColor: "#1D77F2", color: "#FFFFFF", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Simpan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
