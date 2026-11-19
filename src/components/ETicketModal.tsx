import { X, Printer, Calendar, Clock, MapPin, User, CheckCircle2, Ticket } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Registration } from '../types';

interface ETicketModalProps {
  registration: Registration | null;
  onClose: () => void;
}

export const ETicketModal = ({ registration, onClose }: ETicketModalProps) => {
  if (!registration) return null;

  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Mencetak E-Ticket
  const handlePrint = () => {
    window.print();
  };

  const isAttended = registration.status === 'attended';
  const isCancelled = registration.status === 'cancelled';

  return (
    <div className="eventku-modal-overlay" onClick={onClose}>
      <div 
        className="eticket-dialog-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup Modal */}
        <button 
          className="eticket-close-btn" 
          onClick={onClose}
          aria-label="Tutup Tiket"
        >
          <X size={20} />
        </button>

        {/* Tampilan Kartu E-Ticket Fisik Digital */}
        <div className="eticket-card-body" id="printable-ticket">
          {/* Header Tiket */}
          <div className="eticket-header-row">
            <div className="eticket-logo-brand">
              <div className="eticket-badge-icon">
                <Ticket size={18} />
              </div>
              <span className="eticket-brand-text">EventKu</span>
            </div>
            <span className="eticket-type-badge">E-Ticket</span>
          </div>

          {/* Judul Event */}
          <div className="eticket-event-headline">
            <h2 className="eticket-event-title">{registration.eventTitle}</h2>
          </div>

          {/* Area QR Code Asli */}
          <div className="eticket-qr-showcase">
            <div className="eticket-qr-box">
              <QRCodeSVG
                value={registration.ticketCode}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="eticket-code-label">Kode Tiket</div>
            <div className="eticket-code-value">{registration.ticketCode}</div>

            {/* Status Validasi Tiket */}
            <div className="eticket-status-wrapper">
              {isAttended ? (
                <span className="eticket-pill-status attended">
                  <CheckCircle2 size={13} />
                  <span>Sudah Hadir</span>
                </span>
              ) : isCancelled ? (
                <span className="eticket-pill-status cancelled">
                  <span>Dibatalkan</span>
                </span>
              ) : (
                <span className="eticket-pill-status valid">
                  <CheckCircle2 size={13} />
                  <span>Valid</span>
                </span>
              )}
            </div>
          </div>

          {/* Perforasi Garis Tiket */}
          <div className="eticket-perforation-divider">
            <div className="perforation-notch left"></div>
            <div className="perforation-line"></div>
            <div className="perforation-notch right"></div>
          </div>

          {/* Metadata Detail Tiket */}
          <div className="eticket-meta-section">
            <div className="eticket-meta-item">
              <Calendar size={16} className="t-icon" />
              <div>
                <span className="t-label">Tanggal</span>
                <p className="t-val">{formatDate(registration.eventDate)}</p>
              </div>
            </div>

            <div className="eticket-meta-item">
              <Clock size={16} className="t-icon" />
              <div>
                <span className="t-label">Waktu</span>
                <p className="t-val">{registration.eventTime}</p>
              </div>
            </div>

            <div className="eticket-meta-item">
              <MapPin size={16} className="t-icon" />
              <div>
                <span className="t-label">Lokasi</span>
                <p className="t-val">{registration.eventLocation}</p>
              </div>
            </div>

            <div className="eticket-meta-item">
              <User size={16} className="t-icon" />
              <div>
                <span className="t-label">Nama Peserta</span>
                <p className="t-val">{registration.userName}</p>
              </div>
            </div>
          </div>

          {/* Petunjuk Tiket */}
          <div className="eticket-instruction-footer">
            <p>Tunjukkan QR Code ini kepada panitia acara di lokasi saat registrasi kehadiran.</p>
          </div>
        </div>

        {/* Tombol Aksi di Bawah Modal */}
        <div className="eticket-modal-actions no-print">
          <button 
            type="button" 
            onClick={handlePrint}
            className="eventku-btn-primary print-btn"
          >
            <Printer size={16} />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ETicketModal;
