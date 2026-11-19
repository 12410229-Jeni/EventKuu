// ============================================================================
// EVENTKU - ANNOUNCEMENT SERVICE
// Pengelolaan Pengumuman Kampus (CRUD Firestore + Real Initial Seed)
// Sesuai Spesifikasi Database Firestore & Desain Referensi EventKu
// ============================================================================

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Announcement, AnnouncementCategory, AnnouncementStatus } from "../types";

const announcementsCollection = collection(db, "announcements");

// Pengumuman Awal yang Akurat Sesuai Desain Referensi UI
export const DEFAULT_INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-konser-2027",
    announcementId: "ann-konser-2027",
    title: "Pendaftaran Konser Kampus 2027 Dibuka!",
    category: "Event",
    summary: "Pendaftaran untuk Konser Musik Kampus 2027 sudah dibuka. Segera daftarkan dirimu!",
    content: "Halo Civitas Akademika!\n\nKabar gembira yang ditunggu-tunggu telah tiba. Pendaftaran peserta Konser Kampus 2027 resmi dibuka mulai hari ini. Acara ini akan dimeriahkan oleh musisi papan atas serta pertunjukan bakat terbaik mahasiswa.\n\nKuota terbatas untuk 1.200 penonton. Dapatkan E-Ticket digital resmi melalui platform EventKu sekarang juga sebelum kehabisan!",
    imageURL: "/assets/posters/konser-kampus.jpg",
    status: "published",
    createdAt: "12 Nov 2026",
    publishedAt: "12 Nov 2026",
    createdBy: "Admin Kampus",
  },
  {
    id: "ann-campus-day-2027",
    announcementId: "ann-campus-day-2027",
    title: "Campus & Faculty Day 2027",
    category: "Informasi",
    summary: "Kegiatan tahunan kampus dan fakultas akan kembali hadir dengan berbagai acara menarik.",
    content: "Pemberitahuan kepada seluruh mahasiswa dan dosen:\n\nCampus & Faculty Day 2027 akan diselenggarakan pada bulan April 2027 bertempat di seluruh area kampus. Acara ini meliputi pameran inovasi ilmiah fakultas, pentas seni budaya mahasiswa, dan bazaar UMKM kampus.\n\nBagi organisasi mahasiswa atau fakultas yang ingin membuka booth pameran, formulir registrasi stan akan dibuka pekan depan.",
    imageURL: "/assets/posters/campus-day.jpg",
    status: "published",
    createdAt: "10 Nov 2026",
    publishedAt: "10 Nov 2026",
    createdBy: "Bagian Kemahasiswaan",
  },
  {
    id: "ann-jadwal-basket-2026",
    announcementId: "ann-jadwal-basket-2026",
    title: "Perubahan Jadwal Turnamen Basket",
    category: "Penting",
    summary: "Jadwal Turnamen Basket Campus League mengalami perubahan. Silakan cek detail terbaru.",
    content: "PENTING - PERUBAHAN JADWAL PERTANDINGAN BASKET:\n\nSehubungan dengan kegiatan pemeliharaan berkala lantai Sport Center Kampus, seluruh pertandingan Turnamen Basket Campus League pada tanggal 12 November dimajukan mulai pukul 14.00 WITA.\n\nSeluruh kapten tim dan ofisial diharapkan hadir 30 menit sebelum jadwal pertandingan baru untuk proses registrasi dan pemanasan.",
    imageURL: "/assets/posters/turnamen-basket.jpg",
    status: "published",
    createdAt: "8 Nov 2026",
    publishedAt: "8 Nov 2026",
    createdBy: "Komite Olahraga Kampus",
  },
  {
    id: "ann-ai-workshop-2026",
    announcementId: "ann-ai-workshop-2026",
    title: "Pendaftaran Workshop AI & UI/UX Telah Dibuka",
    category: "Event",
    summary: "Tingkatkan keahlian digital masa depanmu dengan workshop interaktif bersama praktisi industri.",
    content: "Dapatkan wawasan mendalam mengenai implementasi generative AI dan atomic design system di industri teknologi. Workshop ini dirancang dengan metode hands-on project di laboratorium multimedia kampus.",
    imageURL: "/assets/posters/creative-media.jpg",
    status: "published",
    createdAt: "5 Nov 2026",
    publishedAt: "5 Nov 2026",
    createdBy: "Admin Kampus",
  },
];

// Helper mapping dokumen Firestore
const mapDocToAnnouncement = (id: string, d: any): Announcement => ({
  id,
  announcementId: id,
  title: d.title || "Pengumuman Kampus",
  category: (d.category as AnnouncementCategory) || "Informasi",
  summary: d.summary || "",
  content: d.content || "",
  imageURL: d.imageURL || "",
  status: (d.status as AnnouncementStatus) || "published",
  createdAt: d.createdAt || "Hari ini",
  publishedAt: d.publishedAt || d.createdAt || "Hari ini",
  createdBy: d.createdBy || "Admin",
});

// Mengambil seluruh pengumuman (Admin)
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const snapshot = await getDocs(
      query(announcementsCollection, orderBy("createdAt", "desc"))
    );
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => mapDocToAnnouncement(docSnap.id, docSnap.data()));
    }
  } catch (error) {
    console.warn("Membaca Firestore announcements:", error);
  }
  return DEFAULT_INITIAL_ANNOUNCEMENTS;
};

// Mengambil pengumuman yang berstatus published (Publik)
export const getPublishedAnnouncements = async (): Promise<Announcement[]> => {
  const all = await getAnnouncements();
  return all.filter((a) => a.status === "published");
};

// Mengambil satu pengumuman berdasarkan ID
export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  try {
    const docRef = doc(db, "announcements", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return mapDocToAnnouncement(snap.id, snap.data());
    }
  } catch (error) {
    console.warn(`Membaca Firestore announcement ${id}:`, error);
  }

  const local = DEFAULT_INITIAL_ANNOUNCEMENTS.find((a) => a.id === id);
  return local || null;
};

// Menambahkan pengumuman baru (Admin / Dari AI Announcement Generator)
export const createAnnouncement = async (
  data: Partial<Announcement>
): Promise<string> => {
  const payload = {
    title: data.title || "Pengumuman Kampus",
    category: data.category || "Informasi",
    summary: data.summary || "",
    content: data.content || "",
    imageURL: data.imageURL || "",
    status: data.status || "published",
    createdAt: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    publishedAt:
      data.status === "published"
        ? new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : undefined,
    createdBy: data.createdBy || "Admin Kampus",
  };

  try {
    const docRef = await addDoc(announcementsCollection, {
      ...payload,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.warn("Gagal simpan announcement ke Firestore, fallback memory:", err);
    const newId = `ann-${Date.now()}`;
    DEFAULT_INITIAL_ANNOUNCEMENTS.unshift({
      id: newId,
      announcementId: newId,
      ...payload,
    } as Announcement);
    return newId;
  }
};

// Memperbarui pengumuman (Admin)
export const updateAnnouncement = async (
  id: string,
  data: Partial<Announcement>
): Promise<void> => {
  try {
    const docRef = doc(db, "announcements", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Gagal update announcement di Firestore, fallback memory:", err);
    const idx = DEFAULT_INITIAL_ANNOUNCEMENTS.findIndex((a) => a.id === id);
    if (idx !== -1) {
      DEFAULT_INITIAL_ANNOUNCEMENTS[idx] = { ...DEFAULT_INITIAL_ANNOUNCEMENTS[idx], ...data };
    }
  }
};

// Menghapus pengumuman (Admin)
export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "announcements", id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Gagal delete announcement dari Firestore:", err);
  }

  const idx = DEFAULT_INITIAL_ANNOUNCEMENTS.findIndex((a) => a.id === id);
  if (idx !== -1) {
    DEFAULT_INITIAL_ANNOUNCEMENTS.splice(idx, 1);
  }
};
