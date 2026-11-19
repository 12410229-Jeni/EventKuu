import { Link } from "react-router-dom";
import { Ticket, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      className="eventku-footer"
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        padding: "60px 24px 30px",
        marginTop: "auto",
      }}
    >
      <div
        className="eventku-footer-container"
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
          gap: "40px",
          marginBottom: "40px",
        }}
      >
        {/* Brand Col */}
        <div>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              marginBottom: "16px",
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
              <Ticket size={20} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#0F2942" }}>EventKu</span>
          </Link>
          <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.6, maxWidth: "340px" }}>
            Platform manajemen dan eksplorasi kegiatan kampus modern terintegrasi.
            Menghubungkan mahasiswa dengan pengalaman akademik, festival seni, dan kompetisi bergengsi.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0F2942", marginBottom: "16px" }}>
            Navigasi
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><Link to="/" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Beranda</Link></li>
            <li><Link to="/events" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Event Kampus</Link></li>
            <li><Link to="/categories" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Kategori Event</Link></li>
            <li><Link to="/announcements" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Pengumuman</Link></li>
            <li><Link to="/about" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Tentang EventKu</Link></li>
            <li><Link to="/contact" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Kontak Layanan</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0F2942", marginBottom: "16px" }}>
            Kategori Utama
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><Link to="/events?category=Sport" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Sport</Link></li>
            <li><Link to="/events?category=Festival" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Festival</Link></li>
            <li><Link to="/events?category=Campus%20%26%20Faculty%20Day" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Campus & Faculty Day</Link></li>
            <li><Link to="/events?category=Teknologi" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Teknologi</Link></li>
            <li><Link to="/events?category=Konser" style={{ color: "#64748B", fontSize: "13.5px", textDecoration: "none" }}>Konser Musik</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0F2942", marginBottom: "16px" }}>
            Kontak Kampus
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", color: "#64748B" }}>
            <p style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <MapPin size={16} color="#1D77F2" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Gedung Student Center Lt. 2, Kampus Terpadu</span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={16} color="#1D77F2" style={{ flexShrink: 0 }} />
              <span>eventku@campus.edu</span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Phone size={16} color="#1D77F2" style={{ flexShrink: 0 }} />
              <span>+62 812-3456-7890</span>
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          paddingTop: "24px",
          borderTop: "1px solid #F1F5F9",
          textAlign: "center",
          fontSize: "12.5px",
          color: "#94A3B8",
        }}
      >
        <p>&copy; {new Date().getFullYear()} EventKu — Campus Event Management Web Application. All rights reserved.</p>
      </div>
    </footer>
  );
};
