import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Tag,
  ArrowLeft,
  User,
  Mail,
  Phone,
  CheckCircle,
} from "lucide-react";
import { getEventById, registerForEvent } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import type { Event } from "../types";

export default function EventRegistrationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentUser, userProfile } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Mengambil detail event
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Gagal mengambil event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Mengirim pendaftaran
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentUser || !event) {
      setError("Silakan login terlebih dahulu.");
      return;
    }

    try {
      setSubmitting(true);

      await registerForEvent({
        userId: currentUser.uid,
        userName:
          userProfile?.fullName ||
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Mahasiswa",
        userEmail: currentUser.email || "",
        userPhone: phone,
        eventId: event.id,
        eventTitle: event.name,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        eventPoster: event.posterUrl,
        ticketPrice: event.price,
        status: "pending",
        paymentStatus: "pending",
      });

      navigate("/dashboard?tab=tickets");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Pendaftaran gagal. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="registration-page">
        <div className="registration-container">
          <div className="eventku-card-skeleton" style={{ height: "400px" }}></div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="registration-page">
        <div className="registration-container not-found-box">
          <h2>Event tidak ditemukan</h2>
          <Link to="/events" className="btn-primary">
            <ArrowLeft size={16} /> Kembali ke Events
          </Link>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="registration-page">
        <div className="registration-container not-found-box">
          <h2>Login untuk mendaftar</h2>
          <p>Silakan masuk ke akunmu terlebih dahulu untuk mendaftar event ini.</p>
          <Link to="/login" className="btn-primary">
            Login ke EventKu
          </Link>
        </div>
      </main>
    );
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Gratis";
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  return (
    <main className="registration-page">
      <div className="registration-container">
        <Link to={`/events/${event.id}`} className="back-link">
          <ArrowLeft size={16} />
          <span>Kembali ke Detail Event</span>
        </Link>

        <div className="registration-card-wrapper">
          <div className="registration-heading">
            <span className="section-label">JOIN THE EVENT</span>
            <h1>Event Registration</h1>
            <p>Lengkapi informasi berikut untuk mendapatkan E-Ticket.</p>
          </div>

          {/* Event Preview Summary */}
          <div className="registration-event">
            <img
              src={event.posterUrl || "/assets/posters/techfest-poster.jpg"}
              alt={`Poster ${event.name}`}
              className="registration-event-poster"
              onError={(e) => {
                e.currentTarget.src = "/assets/posters/techfest-poster.jpg";
              }}
            />

            <div className="registration-event-info">
              <span className="event-category">{event.category}</span>
              <h2>{event.name}</h2>
              <p className="reg-meta-line">
                <CalendarDays size={14} />
                <span>{event.date} • {event.time}</span>
              </p>
              <p className="reg-meta-line">
                <MapPin size={14} />
                <span>{event.location}</span>
              </p>
              <div className="reg-price-badge">
                <Tag size={13} />
                <strong>{formatPrice(event.price)}</strong>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="registration-form">
            <div className="form-group">
              <label>
                <User size={14} /> Nama Lengkap
              </label>
              <input
                type="text"
                value={
                  userProfile?.fullName ||
                  currentUser.displayName ||
                  currentUser.email?.split("@")[0] ||
                  ""
                }
                readOnly
                className="input-readonly"
              />
            </div>

            <div className="form-group">
              <label>
                <Mail size={14} /> Alamat Email
              </label>
              <input
                type="email"
                value={currentUser.email || ""}
                readOnly
                className="input-readonly"
              />
            </div>

            <div className="form-group">
              <label>
                <Phone size={14} /> Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {error && <div className="form-error-alert">{error}</div>}

            <button
              type="submit"
              className="btn-primary reg-submit-btn"
              disabled={submitting}
            >
              <CheckCircle size={17} />
              <span>{submitting ? "Memproses Pendaftaran..." : "Confirm Registration"}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
