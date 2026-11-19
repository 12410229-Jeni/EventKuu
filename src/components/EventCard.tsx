import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { EventItem } from "../types";

interface EventCardProps {
  event: EventItem;
}

const formatPrice = (price: number) => {
  if (!price || price === 0) return "Gratis";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Tanggal belum ditentukan";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const EventCard = ({ event }: EventCardProps) => {
  const eventName = event.name || "Untitled Event";

  const poster =
    event.posterUrl ||
    event.posterURL ||
    "/EventKuu/assets/posters/techfest-poster.jpg";

  return (
    <div className="eventku-card">
      {/* Poster dan kategori */}
      <div className="eventku-card-media">
        <img
          src={poster}
          alt={eventName}
          className="eventku-card-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/EventKuu/assets/posters/techfest-poster.jpg";
          }}
        />

        <div className="eventku-card-badge">
          {event.category || "Event"}
        </div>
      </div>

      {/* Informasi event */}
      <div className="eventku-card-body">
        <h3 className="eventku-card-title" title={eventName}>
          <Link to={`/events/${event.id}`}>
            {eventName}
          </Link>
        </h3>

        <div className="eventku-card-meta">
          <div className="eventku-card-meta-row">
            <Calendar size={14} className="meta-icon" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="eventku-card-meta-row">
            <MapPin size={14} className="meta-icon" />
            <span className="meta-truncate">
              {event.location || "Lokasi belum ditentukan"}
            </span>
          </div>
        </div>

        {/* Harga dan tombol detail */}
        <div className="eventku-card-footer">
          <div className="eventku-card-price">
            {formatPrice(event.price)}
          </div>

          <Link
            to={`/events/${event.id}`}
            className="eventku-card-arrow-btn"
            title={`Lihat detail ${eventName}`}
            aria-label={`Lihat detail ${eventName}`}
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;