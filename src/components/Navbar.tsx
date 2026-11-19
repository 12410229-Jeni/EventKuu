import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Ticket, Menu, X, Bell, User as UserIcon, LogOut, LayoutDashboard, QrCode } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate("/");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const displayName =
    userProfile?.fullName ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    (isAdmin ? "Admin" : "Mahasiswa");

  return (
    <header
      className="navbar"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(15, 35, 60, 0.03)",
      }}
    >
      <div
        className="navbar-container"
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "0 24px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo matching UI Screenshot */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
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
              boxShadow: "0 4px 10px rgba(29, 119, 242, 0.3)",
            }}
          >
            <Ticket size={20} />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#0F2942",
              letterSpacing: "-0.5px",
            }}
          >
            EventKu
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#0F2942",
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Menu */}
        <nav
          className={`navbar-menu ${menuOpen ? "active" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <div
            className="navbar-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1D77F2" : "#334155",
                position: "relative",
                padding: "6px 0",
              })}
            >
              Beranda
            </NavLink>

            <NavLink
              to="/events"
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1D77F2" : "#334155",
                position: "relative",
                padding: "6px 0",
              })}
            >
              Event
            </NavLink>

            <NavLink
              to="/categories"
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1D77F2" : "#334155",
                position: "relative",
                padding: "6px 0",
              })}
            >
              Kategori
            </NavLink>

            <NavLink
              to="/announcements"
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1D77F2" : "#334155",
                position: "relative",
                padding: "6px 0",
              })}
            >
              Pengumuman
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1D77F2" : "#334155",
                position: "relative",
                padding: "6px 0",
              })}
            >
              Tentang
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1D77F2" : "#334155",
                position: "relative",
                padding: "6px 0",
              })}
            >
              Kontak
            </NavLink>
          </div>

          {/* User Auth Section */}
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}>
              {/* Notification Bell */}
              <button
                type="button"
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#475569",
                }}
                title="Notifikasi"
              >
                <Bell size={18} />
              </button>

              {/* User Dropdown Trigger */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "999px",
                    padding: "4px 14px 4px 6px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: isAdmin ? "#FEF3C7" : "#DBEAFE",
                      color: isAdmin ? "#D97706" : "#1D77F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {isAdmin ? "A" : displayName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#0F2942" }}>
                    {isAdmin ? "Admin" : "Mahasiswa"}
                  </span>
                  <span style={{ fontSize: "10px", color: "#64748B" }}>▼</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "46px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      padding: "8px",
                      boxShadow: "0 10px 25px rgba(15, 35, 60, 0.12)",
                      border: "1px solid #E2E8F0",
                      width: "210px",
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: "8px 12px", borderBottom: "1px solid #F1F5F9" }}>
                      <strong style={{ display: "block", fontSize: "13px", color: "#0F2942" }}>{displayName}</strong>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>{currentUser.email}</span>
                    </div>

                    {isAdmin ? (
                      <>
                        <Link
                          to="/admin"
                          onClick={closeMenu}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            fontSize: "13px",
                            color: "#334155",
                            textDecoration: "none",
                            borderRadius: "8px",
                          }}
                        >
                          <LayoutDashboard size={15} /> Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/scan"
                          onClick={closeMenu}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            fontSize: "13px",
                            color: "#334155",
                            textDecoration: "none",
                            borderRadius: "8px",
                          }}
                        >
                          <QrCode size={15} /> Scan Tiket
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={closeMenu}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            fontSize: "13px",
                            color: "#334155",
                            textDecoration: "none",
                            borderRadius: "8px",
                          }}
                        >
                          <LayoutDashboard size={15} /> Dashboard Saya
                        </Link>
                        <Link
                          to="/dashboard?tab=tickets"
                          onClick={closeMenu}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            fontSize: "13px",
                            color: "#334155",
                            textDecoration: "none",
                            borderRadius: "8px",
                          }}
                        >
                          <Ticket size={15} /> E-Ticket Saya
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        fontSize: "13px",
                        color: "#EF4444",
                        width: "100%",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        borderRadius: "8px",
                        textAlign: "left",
                      }}
                    >
                      <LogOut size={15} /> Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/login"
                onClick={closeMenu}
                style={{
                  padding: "8px 22px",
                  borderRadius: "999px",
                  border: "1px solid #1D77F2",
                  color: "#1D77F2",
                  backgroundColor: "#FFFFFF",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                style={{
                  padding: "8px 24px",
                  borderRadius: "999px",
                  border: "none",
                  color: "#FFFFFF",
                  backgroundColor: "#1D77F2",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(29, 119, 242, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                Daftar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
