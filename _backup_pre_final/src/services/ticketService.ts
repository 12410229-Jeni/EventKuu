// ============================================================================
// EVENTKU - TICKET SERVICE
// Pengelolaan Digital E-Ticket & Verifikasi Check-In QR Code
// Sesuai Spesifikasi Database Firestore & Desain Referensi EventKu
// ============================================================================

import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Ticket, TicketStatus } from "../types";

const ticketsCollection = collection(db, "tickets");

// Data E-Ticket Awal untuk Pengguna Demo / Mahasiswa
export const DEFAULT_INITIAL_TICKETS: Ticket[] = [
  {
    id: "tkt-konser-demo",
    ticketId: "tkt-konser-demo",
    registrationId: "reg-konser-demo",
    userId: "demo-user-id",
    userName: "Catherine L. Tampi",
    userEmail: "catherine.tampi@campus.edu",
    userStudentId: "230410021",
    eventId: "evt-konser-kampus-2027",
    eventTitle: "Konser Kampus 2027",
    eventCategory: "Konser",
    eventPoster: "/posters/konser-kampus.jpg",
    eventDate: "12 Nov 2026",
    eventTime: "19.00 - 22.00 WITA",
    eventLocation: "Lapangan Kampus",
    ticketCode: "ETK-20261112-0045",
    qrCodeData: "ETK-20261112-0045|evt-konser-kampus-2027|230410021",
    status: "active",
    createdAt: "2026-11-05",
  },
  {
    id: "tkt-basket-demo",
    ticketId: "tkt-basket-demo",
    registrationId: "reg-basket-demo",
    userId: "demo-user-id",
    userName: "Catherine L. Tampi",
    userEmail: "catherine.tampi@campus.edu",
    userStudentId: "230410021",
    eventId: "evt-turnamen-basket-2026",
    eventTitle: "Turnamen Basket Campus League",
    eventCategory: "Sport",
    eventPoster: "/posters/turnamen-basket.jpg",
    eventDate: "12 - 18 Nov 2026",
    eventTime: "14.00 - 18.00 WITA",
    eventLocation: "Sport Center Kampus",
    ticketCode: "ETK-20261112-0089",
    qrCodeData: "ETK-20261112-0089|evt-turnamen-basket-2026|230410021",
    status: "active",
    createdAt: "2026-11-06",
  },
  {
    id: "tkt-culture-used",
    ticketId: "tkt-culture-used",
    registrationId: "reg-culture-demo",
    userId: "demo-user-id",
    userName: "Catherine L. Tampi",
    userEmail: "catherine.tampi@campus.edu",
    userStudentId: "230410021",
    eventId: "evt-culture-fest-2026",
    eventTitle: "Campus Culture & Art Festival",
    eventCategory: "Festival",
    eventPoster: "/posters/culture-festival.jpg",
    eventDate: "01 - 03 Nov 2026",
    eventTime: "10.00 - 21.00 WITA",
    eventLocation: "Lapangan Terbuka Kampus",
    ticketCode: "ETK-20261101-0012",
    qrCodeData: "ETK-20261101-0012|evt-culture-fest-2026|230410021",
    status: "used",
    createdAt: "2026-10-28",
    checkedInAt: "2026-11-01 10:15 WITA",
  },
];

// Helper membuat kode tiket format resmi ETK-YYYYMMDD-XXXX
export const generateETicketCode = (customDate?: string): string => {
  const now = customDate ? new Date(customDate) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ETK-${year}${month}${day}-${randomSuffix}`;
};

// Mengambil seluruh tiket milik user yang login
export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  try {
    const q = query(ticketsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      }));
    }
  } catch (error) {
    console.warn("Membaca Firestore user tickets:", error);
  }

  return DEFAULT_INITIAL_TICKETS.filter(
    (t) => t.userId === userId || t.userId === "demo-user-id"
  );
};

// Mengambil seluruh tiket (Untuk Admin & Laporan)
export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    const snapshot = await getDocs(ticketsCollection);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      }));
    }
  } catch (error) {
    console.warn("Membaca Firestore all tickets:", error);
  }

  return DEFAULT_INITIAL_TICKETS;
};

// Mengambil satu tiket berdasarkan kode
export const getTicketByCode = async (ticketCode: string): Promise<Ticket | null> => {
  const cleanCode = ticketCode.trim();

  try {
    const q = query(ticketsCollection, where("ticketCode", "==", cleanCode));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return {
        id: docSnap.id,
        ...(docSnap.data() as any),
      };
    }
  } catch (error) {
    console.warn("Membaca Firestore ticket by code:", error);
  }

  // Fallback memory
  const local = DEFAULT_INITIAL_TICKETS.find(
    (t) => t.ticketCode.toLowerCase() === cleanCode.toLowerCase()
  );
  return local || null;
};

// Memverifikasi tiket (Digunakan di QR Scanner Admin)
export const verifyTicketCode = async (
  rawCode: string
): Promise<{
  valid: boolean;
  status: TicketStatus | "not_found" | "invalid_format";
  ticket?: Ticket;
  message: string;
}> => {
  if (!rawCode || !rawCode.trim()) {
    return {
      valid: false,
      status: "invalid_format",
      message: "Kode tiket tidak boleh kosong.",
    };
  }

  // Format QR data bisa berupa "ETK-20261112-0045|evt-...|..." atau kode langsung
  const cleanCode = rawCode.includes("|") ? rawCode.split("|")[0].trim() : rawCode.trim();

  // Validasi lewat REST API backend terlebih dahulu
  try {
    const apiRes = await fetch("/api/validate-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketCode: cleanCode }),
    });
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (!apiData.valid) {
        return {
          valid: false,
          status: "invalid_format",
          message: apiData.error || "Kode tiket tidak valid.",
        };
      }
    }
  } catch (apiErr) {
    console.warn("REST API backend ticket check bypassed/offline:", apiErr);
  }

  const ticket = await getTicketByCode(cleanCode);

  if (!ticket) {
    return {
      valid: false,
      status: "not_found",
      message: "Tiket tidak terdaftar dalam database EventKu.",
    };
  }

  if (ticket.status === "used") {
    return {
      valid: false,
      status: "used",
      ticket,
      message: `Tiket sudah digunakan sebelumnya pada ${ticket.checkedInAt || "hari H"}.`,
    };
  }

  if (ticket.status === "cancelled") {
    return {
      valid: false,
      status: "cancelled",
      ticket,
      message: "Tiket ini telah dibatalkan oleh panitia atau peserta.",
    };
  }

  return {
    valid: true,
    status: "active",
    ticket,
    message: "Tiket valid dan siap dilakukan konfirmasi check-in.",
  };
};

// Konfirmasi Check-In (Mengubah status tiket menjadi 'used')
export const checkInTicket = async (ticket: Ticket): Promise<boolean> => {
  const checkInTimestamp = `${new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} ${new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })} WITA`;

  // Backend check-in call
  try {
    await fetch("/api/checkin-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketCode: ticket.ticketCode, checkInTimestamp }),
    });
  } catch (e) {
    console.warn("Backend checkin ticket api:", e);
  }

  // Update di Firestore
  try {
    const docRef = doc(db, "tickets", ticket.id);
    await updateDoc(docRef, {
      status: "used",
      checkedInAt: checkInTimestamp,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Gagal update check-in di Firestore, fallback memory:", err);
  }

  // Update local memory
  const idx = DEFAULT_INITIAL_TICKETS.findIndex((t) => t.id === ticket.id || t.ticketCode === ticket.ticketCode);
  if (idx !== -1) {
    DEFAULT_INITIAL_TICKETS[idx].status = "used";
    DEFAULT_INITIAL_TICKETS[idx].checkedInAt = checkInTimestamp;
  }

  return true;
};
