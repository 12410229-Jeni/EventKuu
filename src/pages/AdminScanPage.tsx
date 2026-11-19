import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  QrCode,
  Camera,
  Flashlight,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  UserX,
  Search,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyTicketCode, checkInTicket, getAllTickets } from "../services/ticketService";
import type { Ticket } from "../types";

export default function AdminScanPage() {
  const [scannedCode, setScannedCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [verifiedTicket, setVerifiedTicket] = useState<Ticket | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<"success" | "used" | "invalid" | "idle">("idle");
  const [statusMessage, setStatusMessage] = useState("Siap melakukan pemindaian atau masukkan kode tiket.");
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [attendedCount, setAttendedCount] = useState(0);
  const [cameraError, setCameraError] = useState("");

  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load statistik kehadiran nyata dari tiket
  useEffect(() => {
    const loadStats = async () => {
      try {
        const all = await getAllTickets();
        setTotalCount(all.length);
        setAttendedCount(all.filter((t) => t.status === "used").length);
      } catch (err) {
        console.warn("Gagal load statistik tiket:", err);
      }
    };
    loadStats();
  }, []);

  // Cleanup kamera saat unmount
  useEffect(() => {
    return () => {
      if (qrReaderRef.current && isCameraActive) {
        qrReaderRef.current.stop().catch(() => {});
      }
    };
  }, [isCameraActive]);

  // Fungsi memverifikasi kode tiket
  const handleVerify = async (codeToVerify: string) => {
    const clean = codeToVerify.trim();
    if (!clean) return;

    setLoading(true);
    setScannedCode(clean);

    try {
      const res = await verifyTicketCode(clean);
      if (res.valid && res.ticket) {
        setVerifiedTicket(res.ticket);
        setVerifyStatus(res.ticket.status === "used" ? "used" : "success");
        setStatusMessage(
          res.ticket.status === "used"
            ? "Tiket Sudah Digunakan Sebelumnya!"
            : "Tiket Berhasil Diverifikasi!"
        );
      } else if (res.status === "used" && res.ticket) {
        setVerifiedTicket(res.ticket);
        setVerifyStatus("used");
        setStatusMessage("Tiket Sudah Digunakan Sebelumnya!");
      } else {
        setVerifiedTicket(null);
        setVerifyStatus("invalid");
        setStatusMessage(res.message || "Tiket Tidak Valid atau Tidak Terdaftar!");
      }
    } catch (e: any) {
      setVerifyStatus("invalid");
      setStatusMessage("Gagal memverifikasi tiket: " + (e?.message || "Kesalahan jaringan"));
    } finally {
      setLoading(false);
    }
  };

  // Konfirmasi kehadiran check-in
  const handleConfirmCheckin = async () => {
    if (!verifiedTicket) return;

    setLoading(true);
    try {
      await checkInTicket(verifiedTicket);
      setVerifiedTicket({
        ...verifiedTicket,
        status: "used",
        checkedInAt: "Baru saja",
      });
      setVerifyStatus("used");
      setStatusMessage("Check-in Berhasil Dikonfirmasi! Status: Hadir");
      setAttendedCount((prev) => prev + 1);
    } catch (err: any) {
      alert("Gagal konfirmasi kehadiran: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  // Start live camera
  const startCamera = async () => {
    setCameraError("");
    try {
      if (!qrReaderRef.current) {
        qrReaderRef.current = new Html5Qrcode("admin-qr-reader");
      }
      await qrReaderRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleVerify(decodedText);
          stopCamera();
        },
        () => {}
      );
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Gagal memulai kamera scanner:", err);
      setCameraError("Kamera tidak dapat diakses atau izin ditolak. Anda dapat menggunakan input manual atau upload gambar QR.");
    }
  };

  const stopCamera = async () => {
    if (qrReaderRef.current && isCameraActive) {
      try {
        await qrReaderRef.current.stop();
      } catch (e) {}
      setIsCameraActive(false);
    }
  };

  // Scan QR dari file galeri
  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        if (!qrReaderRef.current) {
          qrReaderRef.current = new Html5Qrcode("admin-qr-reader");
        }
        const decodedText = await qrReaderRef.current.scanFile(file, true);
        handleVerify(decodedText);
      } catch (err) {
        alert("Tidak dapat membaca QR Code dari gambar yang dipilih.");
      }
    }
  };

  return (
    <main className="admin-scan-page" style={{ padding: "40px 24px", minHeight: "90vh", backgroundColor: "#F4F8FC" }}>
      <div className="admin-scan-container" style={{ maxWidth: "1140px", margin: "0 auto" }}>
        
        {/* Navigation & Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Link
              to="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#1D77F2",
                fontWeight: 600,
                fontSize: "13.5px",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} /> Kembali ke Dashboard
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#E1EEFD",
                color: "#1D77F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QrCode size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0F2942" }}>Scan E-Ticket</h1>
              <p style={{ fontSize: "14px", color: "#64748B" }}>
                Pindai QR Code peserta untuk verifikasi kehadiran event secara real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Scanner Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* Left Column: QR Scanner Viewport */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(15, 35, 60, 0.05)",
              border: "1px solid #E2E8F0",
            }}
          >
            {/* Viewfinder Area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "360px",
                borderRadius: "20px",
                overflow: "hidden",
                backgroundColor: "#0F172A",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div id="admin-qr-reader" style={{ width: "100%", height: "100%" }}></div>

              {!isCameraActive && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: "url('/EventKuu/auth-students.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(15, 23, 42, 0.75)",
                      backdropFilter: "blur(2px)",
                    }}
                  ></div>

                  {/* Scan overlay frame */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "220px",
                      height: "220px",
                      border: "2px solid rgba(56, 189, 248, 0.8)",
                      borderRadius: "20px",
                      boxShadow: "0 0 25px rgba(56, 189, 248, 0.35)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    <QrCode size={64} color="#38BDF8" style={{ marginBottom: "12px", opacity: 0.9 }} />
                    <span style={{ color: "#F8FAFC", fontSize: "12px", fontWeight: 600 }}>
                      Arahkan QR Code ke dalam area ini
                    </span>
                  </div>
                </div>
              )}
            </div>

            {cameraError && (
              <p style={{ color: "#EF4444", fontSize: "12.5px", marginTop: "10px" }}>{cameraError}</p>
            )}

            {/* Viewport Control Buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1.2fr",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                onClick={() => setFlashlightOn(!flashlightOn)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: flashlightOn ? "#FEF3C7" : "#F8FAFC",
                  color: flashlightOn ? "#D97706" : "#475569",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Flashlight size={15} /> Lampu
              </button>

              <button
                type="button"
                onClick={isCameraActive ? stopCamera : startCamera}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: isCameraActive ? "#FEE2E2" : "#F8FAFC",
                  color: isCameraActive ? "#DC2626" : "#475569",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Camera size={15} /> {isCameraActive ? "Tutup Kamera" : "Ganti Kamera"}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                  color: "#475569",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ImageIcon size={15} /> Pindai Galeri
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileScan}
                style={{ display: "none" }}
              />
            </div>

            {/* Manual Ticket Code Search */}
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
                Atau Masukkan Kode Tiket Manual:
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Contoh: ETK-20261112-0045"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13.5px",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && manualCode) {
                      handleVerify(manualCode);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => manualCode && handleVerify(manualCode)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    backgroundColor: "#1D77F2",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Search size={15} /> Cek
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Validation Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Status Banner */}
            <div
              style={{
                padding: "14px 20px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor:
                  verifyStatus === "success"
                    ? "#DCFCE7"
                    : verifyStatus === "used"
                    ? "#FEF3C7"
                    : verifyStatus === "invalid"
                    ? "#FEE2E2"
                    : "#F1F5F9",
                color:
                  verifyStatus === "success"
                    ? "#15803D"
                    : verifyStatus === "used"
                    ? "#B45309"
                    : verifyStatus === "invalid"
                    ? "#B91C1C"
                    : "#475569",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              {verifyStatus === "success" ? (
                <CheckCircle2 size={22} color="#16A34A" />
              ) : verifyStatus === "used" ? (
                <AlertCircle size={22} color="#D97706" />
              ) : verifyStatus === "invalid" ? (
                <XCircle size={22} color="#DC2626" />
              ) : (
                <QrCode size={22} />
              )}
              <span>{statusMessage}</span>
            </div>

            {/* Participant & Event Info Card */}
            {verifiedTicket ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "26px",
                  boxShadow: "0 4px 20px rgba(15, 35, 60, 0.05)",
                  border: "1px solid #E2E8F0",
                }}
              >
                {/* Student Profile Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "18px",
                    borderBottom: "1px solid #F1F5F9",
                    marginBottom: "18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        backgroundColor: "#DBEAFE",
                        color: "#1D77F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: 700,
                      }}
                    >
                      {verifiedTicket.userName ? verifiedTicket.userName.charAt(0) : "C"}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F2942" }}>
                        {verifiedTicket.userName || "Catherine L. Tampi"}
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748B" }}>
                        NIM {verifiedTicket.userStudentId || "230410021"}
                      </p>
                    </div>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      backgroundColor: verifiedTicket.status === "used" ? "#DCFCE7" : "#EFF6FF",
                      color: verifiedTicket.status === "used" ? "#16A34A" : "#1D77F2",
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {verifiedTicket.status === "used" ? "Hadir" : "Terverifikasi"}
                  </span>
                </div>

                {/* Event Details Grid */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "100px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={15} color="#1D77F2" /> Event
                    </span>
                    <strong style={{ color: "#0F2942" }}>{verifiedTicket.eventTitle}</strong>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "100px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={15} color="#1D77F2" /> Tanggal
                    </span>
                    <span style={{ color: "#334155" }}>{verifiedTicket.eventDate}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "100px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={15} color="#1D77F2" /> Waktu
                    </span>
                    <span style={{ color: "#334155" }}>{verifiedTicket.eventTime}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "100px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={15} color="#1D77F2" /> Lokasi
                    </span>
                    <span style={{ color: "#334155" }}>{verifiedTicket.eventLocation}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "100px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                      <QrCode size={15} color="#1D77F2" /> Kode Tiket
                    </span>
                    <code style={{ color: "#1D77F2", fontWeight: 700, backgroundColor: "#F1F5F9", padding: "2px 8px", borderRadius: "6px" }}>
                      {verifiedTicket.ticketCode}
                    </code>
                  </div>
                </div>

                {/* Confirm Check-in Button */}
                {verifiedTicket.status !== "used" && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleConfirmCheckin}
                    style={{
                      width: "100%",
                      marginTop: "22px",
                      padding: "14px",
                      borderRadius: "999px",
                      backgroundColor: "#16A34A",
                      color: "#FFFFFF",
                      border: "none",
                      fontSize: "14.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
                    }}
                  >
                    <CheckCircle2 size={18} /> Konfirmasi Kehadiran (Check-In)
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "40px 24px",
                  textAlign: "center",
                  border: "1px dashed #CBD5E1",
                }}
              >
                <QrCode size={48} color="#94A3B8" style={{ margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#334155" }}>
                  Belum Ada Tiket Terpindai
                </h3>
                <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
                  Arahkan QR Code peserta ke kamera atau ketikkan kode tiket di sebelah kiri.
                </p>
              </div>
            )}

            {/* Attendance Counters Pill Grid (Matches Reference UI) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "14px",
              }}
            >
              {/* Total Peserta */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "16px",
                  borderRadius: "18px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
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
                <div>
                  <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Total Peserta</span>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#0F2942" }}>{totalCount}</div>
                </div>
              </div>

              {/* Sudah Hadir */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "16px",
                  borderRadius: "18px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: "#DCFCE7",
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserCheck size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Sudah Hadir</span>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#16A34A" }}>{attendedCount}</div>
                </div>
              </div>

              {/* Belum Hadir */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "16px",
                  borderRadius: "18px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: "#F1F5F9",
                    color: "#64748B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserX size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Belum Hadir</span>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#64748B" }}>
                    {totalCount - attendedCount}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
