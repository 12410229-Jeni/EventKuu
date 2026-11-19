import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Clock,
  Tag,
  Users,
  Building,
  ArrowLeft,
  ArrowRight,
  User,
  CheckCircle2,
} from "lucide-react";
import { getEventById } from "../services/eventService";
import type { Event } from "../types";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "speakers" | "schedule" | "location"
  >("overview");

  // Mengambil detail event berdasarkan ID
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error("Gagal mengambil detail event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <main className="event-details-page">
        <div className="details-container">
          <div className="eventku-card-skeleton" style={{ height: "450px" }}></div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-details-page">
        <div className="details-container not-found-box">
          <h2>Event tidak ditemukan</h2>
          <p>Acara yang kamu cari mungkin telah berakhir atau dihapus.</p>
          <Link to="/events" className="btn-primary">
            <ArrowLeft size={16} /> Kembali ke Events
          </Link>
        </div>
      </main>
    );
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Gratis";
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const isSoldOut = event.capacity > 0 && event.registeredCount >= event.capacity;

  return (
    <main className="event-details-page">
      <div className="details-container">
        {/* Breadcrumb / Back Link */}
        <Link to="/events" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </Link>

        {/* Hero Card matching Screen 3 in Reference Design */}
        <section className="detail-hero-grid">
          <div className="detail-poster-wrap">
            <img
              src={event.posterUrl || "/posters/techfest-poster.jpg"}
              alt={`Poster ${event.name}`}
              className="detail-poster-img"
              onError={(e) => {
                e.currentTarget.src = "/posters/techfest-poster.jpg";
              }}
            />
            <span className="detail-category-badge">{event.category}</span>
          </div>

          <div className="detail-info-col">
            <div className="detail-category-pill">{event.category}</div>

            <h1 className="detail-event-title">{event.name}</h1>

            <div className="detail-meta-list">
              <div className="detail-meta-item">
                <CalendarDays size={18} className="detail-meta-icon" />
                <div>
                  <span className="meta-sub">Tanggal & Waktu</span>
                  <p className="meta-val">
                    {event.date} {event.time ? `• ${event.time}` : ""}
                  </p>
                </div>
              </div>

              <div className="detail-meta-item">
                <MapPin size={18} className="detail-meta-icon" />
                <div>
                  <span className="meta-sub">Lokasi</span>
                  <p className="meta-val">{event.location}</p>
                </div>
              </div>

              <div className="detail-meta-item">
                <Tag size={18} className="detail-meta-icon" />
                <div>
                  <span className="meta-sub">Harga Tiket</span>
                  <p className="meta-val price-highlight">
                    {formatPrice(event.price)}
                  </p>
                </div>
              </div>

              <div className="detail-meta-item">
                <Users size={18} className="detail-meta-icon" />
                <div>
                  <span className="meta-sub">Kapasitas Peserta</span>
                  <p className="meta-val">
                    Kuota: {event.registeredCount || 0} / {event.capacity} peserta
                  </p>
                </div>
              </div>

              {event.organizer && (
                <div className="detail-meta-item">
                  <Building size={18} className="detail-meta-icon" />
                  <div>
                    <span className="meta-sub">Penyelenggara</span>
                    <p className="meta-val">{event.organizer}</p>
                  </div>
                </div>
              )}
            </div>

            {event.registrationDeadline && (
              <p className="detail-deadline-note">
                <strong>Batas Pendaftaran:</strong> {event.registrationDeadline}
              </p>
            )}

            {isSoldOut ? (
              <button className="btn-primary detail-cta-btn disabled" disabled>
                Kuota Penuh
              </button>
            ) : (
              <Link
                to={`/events/${event.id}/register`}
                className="btn-primary detail-cta-btn"
              >
                Register Now <ArrowRight size={17} />
              </Link>
            )}
          </div>
        </section>

        {/* Tab Navigation matching Screen 3 */}
        <section className="detail-tabs-section">
          <div className="detail-tabs-header">
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === "speakers" ? "active" : ""}`}
              onClick={() => setActiveTab("speakers")}
            >
              Speakers
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              Schedule
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === "location" ? "active" : ""}`}
              onClick={() => setActiveTab("location")}
            >
              Location
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="detail-tab-content">
            {activeTab === "overview" && (
              <div className="tab-pane-overview">
                <h3>About This Event</h3>
                <p className="detail-description-text">
                  {event.description ||
                    "Seminar yang membahas perkembangan teknologi terkini, peluang karier di bidang digital, serta peran mahasiswa dalam menghadapi era transformasi digital."}
                </p>

                <div className="event-highlights-grid">
                  <div className="highlight-item">
                    <CheckCircle2 size={16} className="highlight-icon" />
                    <span>Sertifikat Digital Resmi Kampus</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle2 size={16} className="highlight-icon" />
                    <span>Materi Presentasi & Recording Sesi</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle2 size={16} className="highlight-icon" />
                    <span>Kesempatan Networking & Diskusi Tanya Jawab</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle2 size={16} className="highlight-icon" />
                    <span>Akses Grup Diskusi Komunitas EventKu</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "speakers" && (
              <div className="tab-pane-speakers">
                <h3>Event Speakers</h3>
                {event.speakers && event.speakers.length > 0 ? (
                  <div className="speakers-grid">
                    {event.speakers.map((sp, idx) => (
                      <div className="speaker-card" key={idx}>
                        <div className="speaker-avatar">
                          {sp.photoUrl ? (
                            <img src={sp.photoUrl} alt={sp.name} />
                          ) : (
                            <User size={28} />
                          )}
                        </div>
                        <div className="speaker-info">
                          <h4>{sp.name}</h4>
                          <span className="speaker-role">{sp.role}</span>
                          {sp.bio && <p className="speaker-bio">{sp.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="tab-empty-info">
                    <p>Pembicara terkemuka dari akademisi dan industri profesional kampus.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="tab-pane-schedule">
                <h3>Event Schedule & Rundown</h3>
                {event.schedule && event.schedule.length > 0 ? (
                  <div className="schedule-timeline">
                    {event.schedule.map((item, idx) => (
                      <div className="schedule-item" key={idx}>
                        <div className="schedule-time">
                          <Clock size={14} />
                          <span>{item.time}</span>
                        </div>
                        <div className="schedule-activity">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="schedule-timeline">
                    <div className="schedule-item">
                      <div className="schedule-time">
                        <Clock size={14} />
                        <span>08:00 - 08:30</span>
                      </div>
                      <div className="schedule-activity">Registrasi Kehadiran & Check-in QR Code</div>
                    </div>
                    <div className="schedule-item">
                      <div className="schedule-time">
                        <Clock size={14} />
                        <span>08:30 - 09:00</span>
                      </div>
                      <div className="schedule-activity">Pembukaan & Sambutan Panitia</div>
                    </div>
                    <div className="schedule-item">
                      <div className="schedule-time">
                        <Clock size={14} />
                        <span>09:00 - 11:30</span>
                      </div>
                      <div className="schedule-activity">Sesi Utama Materi & Workshop Interaktif</div>
                    </div>
                    <div className="schedule-item">
                      <div className="schedule-time">
                        <Clock size={14} />
                        <span>11:30 - 12:00</span>
                      </div>
                      <div className="schedule-activity">Tanya Jawab (Q&A), Doorprize, dan Penutupan</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "location" && (
              <div className="tab-pane-location">
                <h3>Venue & Location</h3>
                <div className="location-detail-card">
                  <MapPin size={22} className="location-pin-icon" />
                  <div>
                    <h4>{event.location}</h4>
                    <p>Kampus Universitas, Gedung Utama / Student Hall.</p>
                    <span className="location-note">
                      Pastikan tiba 15 menit sebelum acara dimulai untuk kemudahan proses registrasi dan check-in E-Ticket.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
