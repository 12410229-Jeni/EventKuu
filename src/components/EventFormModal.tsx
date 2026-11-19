import React, { useState, useEffect } from "react";
import { X, Upload, Calendar, Clock, MapPin, Tag, Users, Building } from "lucide-react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import type { Event, EventCategory, EventStatus } from "../types";
import { EVENT_CATEGORIES } from "../types";

export interface EventFormModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: (data: Omit<Event, "id">) => Promise<void>;
  initialData?: Event | null;
  mode?: "add" | "edit";
  existingEvent?: Event; // Backward compatibility
}

export default function EventFormModal({
  isOpen = true,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
  existingEvent,
}: EventFormModalProps) {
  const targetEvent = initialData || existingEvent;
  const isEdit = mode === "edit" || !!targetEvent;

  const [form, setForm] = useState({
    title: "",
    category: "Sport" as EventCategory,
    date: "",
    startTime: "09:00",
    endTime: "16:00",
    time: "09.00 - 16.00 WITA",
    location: "",
    description: "",
    quota: 100,
    price: 0,
    organizer: "BEM Kampus",
    status: "upcoming" as EventStatus,
    posterUrl: "/assets/posters/techfest-poster.jpg",
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (targetEvent) {
      setForm({
        title: targetEvent.title || targetEvent.name || "",
        category: targetEvent.category || "Sport",
        date: targetEvent.date ? targetEvent.date.slice(0, 10) : "",
        startTime: targetEvent.startTime || "09:00",
        endTime: targetEvent.endTime || "16:00",
        time: targetEvent.time || "09.00 - 16.00 WITA",
        location: targetEvent.location || "",
        description: targetEvent.description || "",
        quota: targetEvent.quota || targetEvent.capacity || 100,
        price: targetEvent.price || 0,
        organizer: targetEvent.organizer || "BEM Kampus",
        status: targetEvent.status || "upcoming",
        posterUrl: targetEvent.posterUrl || targetEvent.posterURL || "/assets/posters/techfest-poster.jpg",
      });
      setPosterPreview(targetEvent.posterUrl || targetEvent.posterURL || "/assets/posters/techfest-poster.jpg");
    } else {
      setForm({
        title: "",
        category: "Sport",
        date: new Date().toISOString().slice(0, 10),
        startTime: "09:00",
        endTime: "16:00",
        time: "09.00 - 16.00 WITA",
        location: "Auditorium Kampus",
        description: "",
        quota: 150,
        price: 0,
        organizer: "BEM Kampus",
        status: "upcoming",
        posterUrl: "/assets/posters/techfest-poster.jpg",
      });
      setPosterPreview("/assets/posters/techfest-poster.jpg");
    }
    setPosterFile(null);
    setStatus("idle");
    setErrorMsg("");
  }, [targetEvent, isOpen]);

  if (isOpen === false) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quota" || name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("uploading");
    setErrorMsg("");

    try {
      let finalPosterUrl = form.posterUrl;

      // Unggah ke Firebase Storage jika admin memilih file gambar baru
      if (posterFile) {
        try {
          const storageRef = ref(storage, `posters/${Date.now()}_${posterFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, posterFile);
          await new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (err) => reject(err),
              async () => {
                finalPosterUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(null);
              }
            );
          });
        } catch (storageErr) {
          console.warn("Storage upload fallback ke preview lokal:", storageErr);
          finalPosterUrl = posterPreview || "/assets/posters/techfest-poster.jpg";
        }
      }

      const formattedTime = `${form.startTime} - ${form.endTime} WITA`;

      const payload: Omit<Event, "id"> = {
        title: form.title,
        name: form.title,
        category: form.category,
        description: form.description,
        posterUrl: finalPosterUrl,
        posterURL: finalPosterUrl,
        date: form.date,
        dateDisplay: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        time: formattedTime,
        location: form.location,
        price: Number(form.price),
        capacity: Number(form.quota),
        quota: Number(form.quota),
        registeredCount: targetEvent?.registeredCount || 0,
        status: form.status,
        organizer: form.organizer,
      };

      setStatus("saving");

      if (onSubmit) {
        await onSubmit(payload);
      }

      setStatus("done");
      onClose();
    } catch (err: any) {
      console.error("Gagal simpan event:", err);
      setErrorMsg(err.message || "Gagal menyimpan event");
      setStatus("error");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content event-form-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "680px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 20px 40px rgba(15, 35, 60, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "1px solid #EEF2F6",
            paddingBottom: "16px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0F2942" }}>
              {isEdit ? "Edit Kegiatan Kampus" : "Tambah Kegiatan Kampus Baru"}
            </h2>
            <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
              Kelola informasi acara resmi kampus di platform EventKu
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748B",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#FEE2E2",
              color: "#B91C1C",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Judul Event */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Nama Event <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Konser Kampus 2027"
              value={form.title}
              onChange={handleInputChange}
              className="eventku-input"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Kategori & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                <Tag size={14} style={{ display: "inline", marginRight: "4px" }} /> Kategori <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Status Publikasi
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="ongoing">Sedang Berlangsung</option>
                <option value="upcoming">Akan Datang</option>
                <option value="completed">Sudah Selesai</option>
                <option value="draft">Draft (Disembunyikan)</option>
              </select>
            </div>
          </div>

          {/* Tanggal & Waktu */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                <Calendar size={14} style={{ display: "inline", marginRight: "4px" }} /> Tanggal <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={form.date}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                <Clock size={14} style={{ display: "inline", marginRight: "4px" }} /> Jam Mulai
              </label>
              <input
                type="text"
                name="startTime"
                placeholder="19:00"
                value={form.startTime}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Jam Selesai
              </label>
              <input
                type="text"
                name="endTime"
                placeholder="22:00"
                value={form.endTime}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Lokasi & Kuota */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                <MapPin size={14} style={{ display: "inline", marginRight: "4px" }} /> Lokasi Pelaksanaan <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="Contoh: Lapangan Kampus"
                value={form.location}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                <Users size={14} style={{ display: "inline", marginRight: "4px" }} /> Kuota Peserta <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="number"
                name="quota"
                min="1"
                required
                value={form.quota}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Penyelenggara */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              <Building size={14} style={{ display: "inline", marginRight: "4px" }} /> Penyelenggara (Organizer)
            </label>
            <input
              type="text"
              name="organizer"
              placeholder="Contoh: BEM Universitas & UKM Musik"
              value={form.organizer}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Poster Upload (Firebase Storage) */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              <Upload size={14} style={{ display: "inline", marginRight: "4px" }} /> Poster Event (Firebase Storage)
            </label>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {posterPreview && (
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    fontSize: "13px",
                    color: "#475569",
                  }}
                />
                <p style={{ fontSize: "11.5px", color: "#64748B", marginTop: "4px" }}>
                  Format JPG, PNG, atau WEBP. Poster akan otomatis diunggah ke Firebase Storage.
                </p>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Deskripsi Lengkap Event <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Jelaskan detail rangkaian kegiatan, syarat peserta, dan informasi penting lainnya..."
              value={form.description}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "12px",
              borderTop: "1px solid #EEF2F6",
              paddingTop: "16px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={status === "uploading" || status === "saving"}
              style={{
                padding: "10px 20px",
                borderRadius: "999px",
                border: "1px solid #CBD5E1",
                backgroundColor: "#FFFFFF",
                color: "#475569",
                fontWeight: 600,
                fontSize: "13.5px",
                cursor: "pointer",
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={status === "uploading" || status === "saving"}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#1D77F2",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(29, 119, 242, 0.3)",
              }}
            >
              {status === "uploading"
                ? "Mengunggah Poster..."
                : status === "saving"
                ? "Menyimpan Event..."
                : isEdit
                ? "Simpan Perubahan"
                : "Publikasikan Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
