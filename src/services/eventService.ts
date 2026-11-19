// ============================================================================
// EVENTKU - EVENT SERVICE
// Pengelolaan Data Event Kampus (CRUD Firestore + Real Initial Seed)
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
  where,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Event, EventCategory, EventStatus, Registration, Ticket } from "../types";
import { generateETicketCode } from "./ticketService";

const eventsCollection = collection(db, "events");
const registrationsCollection = collection(db, "registrations");
const ticketsCollection = collection(db, "tickets");

// 8 Kategori Wajib EventKu
export const EVENT_CATEGORIES: EventCategory[] = [
  "Sport",
  "Festival",
  "Campus & Faculty Day",
  "Competition",
  "Workshop",
  "Teknologi",
  "Game",
  "Konser",
];

// Data Awal Event Kampus yang Akurat Sesuai Desain Referensi UI
export const DEFAULT_INITIAL_EVENTS: Event[] = [
  {
    id: "evt-game-fest-2026",
    eventId: "evt-game-fest-2026",
    title: "Campus Game Fest 2026",
    name: "Campus Game Fest 2026",
    category: "Game",
    description: "Turnamen esport antar fakultas terbesar di kampus! Kompetisi game Mobile Legends, Valorant, dan FIFA dengan total hadiah jutaan rupiah serta merchandise eksklusif EventKu.",
    posterUrl: "/posters/game-fest.jpg",
    posterURL: "/posters/game-fest.jpg",
    date: "2026-11-10",
    dateDisplay: "10 - 14 Nov 2026",
    time: "10.00 - 18.00 WITA",
    startTime: "10:00",
    endTime: "18:00",
    location: "Lab Multimedia",
    price: 0,
    capacity: 200,
    quota: 200,
    registeredCount: 145,
    status: "ongoing",
    organizer: "BEM Fakultas Ilmu Komputer",
    contactPerson: "Aldo Pratama",
    contactEmail: "gamefest@campus.edu",
    registrationDeadline: "2026-11-09",
    speakers: [{ name: "Aldo Pratama", role: "Ketua Panitia Esport" }],
    schedule: [{ time: "10:00", activity: "Opening Match Mobile Legends" }],
  },
  {
    id: "evt-turnamen-basket-2026",
    eventId: "evt-turnamen-basket-2026",
    title: "Turnamen Basket Campus League",
    name: "Turnamen Basket Campus League",
    category: "Sport",
    description: "Liga basket bergengsi antar mahasiswa dan program studi. Tunjukkan sportivitas dan dukung tim fakultasmu menuju gelar juara musim ini!",
    posterUrl: "/posters/turnamen-basket.jpg",
    posterURL: "/posters/turnamen-basket.jpg",
    date: "2026-11-12",
    dateDisplay: "12 - 18 Nov 2026",
    time: "14.00 - 18.00 WITA",
    startTime: "14:00",
    endTime: "18:00",
    location: "Sport Center Kampus",
    price: 0,
    capacity: 350,
    quota: 350,
    registeredCount: 325,
    status: "ongoing",
    organizer: "UKM Bola Basket Kampus",
    contactPerson: "Bima Santoso",
    contactEmail: "basket@campus.edu",
    registrationDeadline: "2026-11-11",
    speakers: [{ name: "Coach Hendra", role: "Pelatih Tim Kampus" }],
    schedule: [{ time: "14:00", activity: "Babak Penyisihan Grup A & B" }],
  },
  {
    id: "evt-seminar-teknologi-2026",
    eventId: "evt-seminar-teknologi-2026",
    title: "Seminar Teknologi dan Inovasi Digital",
    name: "Seminar Teknologi dan Inovasi Digital",
    category: "Teknologi",
    description: "Menghadirkan pakar industri kecerdasan buatan dan transformasi digital. Pelajari tren generative AI, cloud computing, dan peluang karier tech masa depan.",
    posterUrl: "/posters/seminar-teknologi.jpg",
    posterURL: "/posters/seminar-teknologi.jpg",
    date: "2026-11-14",
    dateDisplay: "14 - 15 Nov 2026",
    time: "09.00 - 15.00 WITA",
    startTime: "09:00",
    endTime: "15:00",
    location: "Auditorium Kampus",
    price: 0,
    capacity: 500,
    quota: 500,
    registeredCount: 420,
    status: "ongoing",
    organizer: "Himpunan Mahasiswa Teknologi Informasi",
    contactPerson: "Clarissa Dewi",
    contactEmail: "seminartech@campus.edu",
    registrationDeadline: "2026-11-13",
    speakers: [{ name: "Dr. Ir. Rian Ardiansyah", role: "AI Research Scientist" }],
    schedule: [{ time: "09:00", activity: "Keynote: Masa Depan Agentic AI di Dunia Pendidikan" }],
  },
  {
    id: "evt-konser-kampus-2027",
    eventId: "evt-konser-kampus-2027",
    title: "Konser Kampus 2027",
    name: "Konser Kampus 2027",
    category: "Konser",
    description: "Malam puncak festival musik mahasiswa dengan penampilan bintang tamu nasional, band kampus favorit, bazaar kuliner, dan pesta kembang api spektakuler.",
    posterUrl: "/posters/konser-kampus.jpg",
    posterURL: "/posters/konser-kampus.jpg",
    date: "2027-01-30",
    dateDisplay: "Jum, 30 Jan 2027",
    time: "19.00 - 22.00 WITA",
    startTime: "19:00",
    endTime: "22:00",
    location: "Lapangan Kampus",
    price: 0,
    capacity: 1200,
    quota: 1200,
    registeredCount: 350,
    status: "upcoming",
    organizer: "BEM Universitas & UKM Musik",
    contactPerson: "Kevin Gunawan",
    contactEmail: "konser@campus.edu",
    registrationDeadline: "2027-01-25",
    speakers: [{ name: "Guest Star Band", role: "Bintang Tamu Utama" }],
    schedule: [{ time: "19:00", activity: "Opening Act & Band Mahasiswa" }],
  },
  {
    id: "evt-campus-day-2027",
    eventId: "evt-campus-day-2027",
    title: "Campus & Faculty Day 2027",
    name: "Campus & Faculty Day 2027",
    category: "Campus & Faculty Day",
    description: "Perayaan tahunan seluruh fakultas kampus! Pameran inovasi riset, pentas tari budaya nusantara, stan kewirausahaan mahasiswa, dan games interaktif terbuka untuk seluruh sivitas akademika.",
    posterUrl: "/posters/campus-day.jpg",
    posterURL: "/posters/campus-day.jpg",
    date: "2027-04-24",
    dateDisplay: "Sab, 24 Apr 2027",
    time: "09.00 - 16.00 WITA",
    startTime: "09:00",
    endTime: "16:00",
    location: "Area Kampus",
    price: 0,
    capacity: 800,
    quota: 800,
    registeredCount: 428,
    status: "upcoming",
    organizer: "Panitia Dies Natalis Kampus",
    contactPerson: "Dr. Siti Rahma",
    contactEmail: "campusday@campus.edu",
    registrationDeadline: "2027-04-20",
    speakers: [{ name: "Pimpinan Universitas", role: "Sambutan Rektorat" }],
    schedule: [{ time: "09:00", activity: "Parade Fakultas dan Karnaval Seni" }],
  },
  {
    id: "evt-culture-fest-2026",
    eventId: "evt-culture-fest-2026",
    title: "Campus Culture & Art Festival",
    name: "Campus Culture & Art Festival",
    category: "Festival",
    description: "Festival seni dan budaya tahunan mahasiswa dengan pameran lukisan, pertunjukan teater, kostum adat nusantara, dan workshop kerajinan tangan.",
    posterUrl: "/posters/culture-festival.jpg",
    posterURL: "/posters/culture-festival.jpg",
    date: "2026-11-01",
    dateDisplay: "01 - 03 Nov 2026",
    time: "10.00 - 21.00 WITA",
    startTime: "10:00",
    endTime: "21:00",
    location: "Lapangan Terbuka Kampus",
    price: 0,
    capacity: 600,
    quota: 600,
    registeredCount: 580,
    status: "completed",
    organizer: "Dewan Kesenian Mahasiswa",
    contactPerson: "Larasati",
    contactEmail: "culturefest@campus.edu",
    registrationDeadline: "2026-10-30",
  },
  {
    id: "evt-techfest-workshop-2026",
    eventId: "evt-techfest-workshop-2026",
    title: "Workshop UI/UX Design System Modern",
    name: "Workshop UI/UX Design System Modern",
    category: "Workshop",
    description: "Pelatihan intensif perancangan design system, atomic design, prototyping dengan Figma, dan implementasi ke React TypeScript oleh UI/UX Lead startup nasional.",
    posterUrl: "/posters/creative-media.jpg",
    posterURL: "/posters/creative-media.jpg",
    date: "2026-12-05",
    dateDisplay: "Sab, 05 Des 2026",
    time: "09.00 - 16.00 WITA",
    startTime: "09:00",
    endTime: "16:00",
    location: "Gedung Lab Desain Komputer",
    price: 0,
    capacity: 100,
    quota: 100,
    registeredCount: 78,
    status: "upcoming",
    organizer: "Creative Media Club",
    contactPerson: "Dian Anggraini",
    contactEmail: "uiuxworkshop@campus.edu",
    registrationDeadline: "2026-12-03",
  },
  {
    id: "evt-debate-competition-2026",
    eventId: "evt-debate-competition-2026",
    title: "National Campus Debate Championship",
    name: "National Campus Debate Championship",
    category: "Competition",
    description: "Kompetisi debat ilmiah mahasiswa tingkat nasional dengan tema 'Inovasi Digital dan Kebijakan Publik untuk Masa Depan Berkelanjutan'.",
    posterUrl: "/posters/debate-open.jpg",
    posterURL: "/posters/debate-open.jpg",
    date: "2026-12-18",
    dateDisplay: "18 - 20 Des 2026",
    time: "08.30 - 17.00 WITA",
    startTime: "08:30",
    endTime: "17:00",
    location: "Ruang Sidang Utama Kampus",
    price: 0,
    capacity: 120,
    quota: 120,
    registeredCount: 96,
    status: "upcoming",
    organizer: "UKM English & Scientific Debate",
    contactPerson: "Farhan Hakim",
    contactEmail: "debate@campus.edu",
    registrationDeadline: "2026-12-15",
  },
];

// Helper normalisasi dokumen Firestore ke interface Event
const mapDocToEvent = (docId: string, d: any): Event => {
  const title = d.title || d.name || "Event Kampus";
  const quota = typeof d.quota === "number" ? d.quota : (typeof d.capacity === "number" ? d.capacity : 100);
  const poster = d.posterUrl || d.posterURL || "/posters/konser-kampus.jpg";
  return {
    id: docId,
    eventId: docId,
    title,
    name: title,
    category: (d.category as EventCategory) || "Festival",
    description: d.description || "",
    posterUrl: poster,
    posterURL: poster,
    date: d.date || "2026-11-12",
    dateDisplay: d.dateDisplay || d.date || "12 Nov 2026",
    time: d.time || "10.00 - 16.00 WITA",
    startTime: d.startTime || d.time?.split("-")[0]?.trim() || "10:00",
    endTime: d.endTime || d.time?.split("-")[1]?.trim() || "16:00",
    location: d.location || "Kampus Utama",
    price: typeof d.price === "number" ? d.price : 0,
    capacity: quota,
    quota: quota,
    registeredCount: typeof d.registeredCount === "number" ? d.registeredCount : 0,
    status: (d.status as EventStatus) || "upcoming",
    organizer: d.organizer || "BEM Kampus",
    contactPerson: d.contactPerson || "",
    contactEmail: d.contactEmail || "",
    registrationDeadline: d.registrationDeadline || "",
    speakers: d.speakers || [],
    schedule: d.schedule || [],
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
};

// Mengambil seluruh event dari Firestore (dengan fallback seed)
export const getEvents = async (): Promise<Event[]> => {
  try {
    const snapshot = await getDocs(query(eventsCollection, orderBy("date", "desc")));
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => mapDocToEvent(docSnap.id, docSnap.data()));
    }
  } catch (error) {
    console.warn("Membaca Firestore events:", error);
  }
  return DEFAULT_INITIAL_EVENTS;
};

// Mengambil event aktif
export const getActiveEvents = async (): Promise<Event[]> => {
  const allEvents = await getEvents();
  return allEvents.filter(
    (e) => e.status === "ongoing" || e.status === "upcoming" || e.status === "published"
  );
};

// Mengambil satu event berdasarkan ID
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const docRef = doc(db, "events", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return mapDocToEvent(snap.id, snap.data());
    }
  } catch (error) {
    console.warn(`Membaca Firestore event ${id}:`, error);
  }

  const local = DEFAULT_INITIAL_EVENTS.find((e) => e.id === id);
  return local || null;
};

// Menambahkan event baru (Admin CRUD)
export const createEvent = async (
  eventData: Partial<Event> | Omit<Event, "id">
): Promise<string> => {
  const title = eventData.title || eventData.name || "Event Baru";
  const quota = Number(eventData.quota || eventData.capacity || 100);
  const poster = eventData.posterUrl || eventData.posterURL || "/posters/konser-kampus.jpg";

  const payload = {
    title,
    name: title,
    category: eventData.category || "Festival",
    description: eventData.description || "",
    posterUrl: poster,
    posterURL: poster,
    date: eventData.date || new Date().toISOString().slice(0, 10),
    dateDisplay: eventData.dateDisplay || eventData.date,
    time: eventData.time || "10.00 - 15.00 WITA",
    startTime: eventData.startTime || "10:00",
    endTime: eventData.endTime || "15:00",
    location: eventData.location || "Area Kampus",
    price: Number(eventData.price || 0),
    quota,
    capacity: quota,
    registeredCount: 0,
    status: eventData.status || "upcoming",
    organizer: eventData.organizer || "BEM Kampus",
    contactPerson: eventData.contactPerson || "",
    contactEmail: eventData.contactEmail || "",
    speakers: eventData.speakers || [],
    schedule: eventData.schedule || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(eventsCollection, payload);
    return docRef.id;
  } catch (err) {
    console.warn("Gagal simpan event ke Firestore, fallback local memory:", err);
    const newId = `evt-${Date.now()}`;
    DEFAULT_INITIAL_EVENTS.unshift({
      id: newId,
      eventId: newId,
      ...payload,
    } as Event);
    return newId;
  }
};

// Mengubah data event (Admin CRUD)
export const updateEvent = async (
  id: string,
  eventData: Partial<Event>
): Promise<void> => {
  const updatePayload: any = {
    ...eventData,
    updatedAt: serverTimestamp(),
  };
  if (eventData.title && !eventData.name) updatePayload.name = eventData.title;
  if (eventData.name && !eventData.title) updatePayload.title = eventData.name;
  if (eventData.quota !== undefined && eventData.capacity === undefined) updatePayload.capacity = eventData.quota;
  if (eventData.capacity !== undefined && eventData.quota === undefined) updatePayload.quota = eventData.capacity;
  if (eventData.posterUrl && !eventData.posterURL) updatePayload.posterURL = eventData.posterUrl;
  if (eventData.posterURL && !eventData.posterUrl) updatePayload.posterUrl = eventData.posterURL;

  try {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, updatePayload);
  } catch (err) {
    console.warn("Gagal update event di Firestore, fallback memory:", err);
    const idx = DEFAULT_INITIAL_EVENTS.findIndex((e) => e.id === id);
    if (idx !== -1) {
      DEFAULT_INITIAL_EVENTS[idx] = { ...DEFAULT_INITIAL_EVENTS[idx], ...updatePayload };
    }
  }
};

// Menghapus event (Admin CRUD)
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "events", id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Gagal delete event dari Firestore:", err);
  }
  const idx = DEFAULT_INITIAL_EVENTS.findIndex((e) => e.id === id);
  if (idx !== -1) {
    DEFAULT_INITIAL_EVENTS.splice(idx, 1);
  }
};

// ============================================================================
// REGISTRATION & PARTICIPANTS FUNCTIONALITY
// ============================================================================

export const DEFAULT_INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: "reg-konser-demo",
    registrationId: "reg-konser-demo",
    userId: "demo-user-id",
    userName: "Catherine L. Tampi",
    userEmail: "catherine.tampi@campus.edu",
    userStudentId: "230410021",
    userPhone: "081234567890",
    eventId: "evt-konser-kampus-2027",
    eventTitle: "Konser Kampus 2027",
    eventDate: "12 Nov 2026",
    eventTime: "19.00 - 22.00 WITA",
    eventLocation: "Lapangan Kampus",
    eventPoster: "/posters/konser-kampus.jpg",
    ticketCode: "ETK-20261112-0045",
    ticketPrice: 0,
    status: "confirmed",
    registeredAt: "2026-11-05",
  },
  {
    id: "reg-basket-demo",
    registrationId: "reg-basket-demo",
    userId: "demo-user-id",
    userName: "Catherine L. Tampi",
    userEmail: "catherine.tampi@campus.edu",
    userStudentId: "230410021",
    userPhone: "081234567890",
    eventId: "evt-turnamen-basket-2026",
    eventTitle: "Turnamen Basket Campus League",
    eventDate: "12 - 18 Nov 2026",
    eventTime: "14.00 - 18.00 WITA",
    eventLocation: "Sport Center Kampus",
    eventPoster: "/posters/turnamen-basket.jpg",
    ticketCode: "ETK-20261112-0089",
    ticketPrice: 0,
    status: "confirmed",
    registeredAt: "2026-11-06",
  },
  {
    id: "reg-culture-demo",
    registrationId: "reg-culture-demo",
    userId: "demo-user-id",
    userName: "Catherine L. Tampi",
    userEmail: "catherine.tampi@campus.edu",
    userStudentId: "230410021",
    userPhone: "081234567890",
    eventId: "evt-culture-fest-2026",
    eventTitle: "Campus Culture & Art Festival",
    eventDate: "01 - 03 Nov 2026",
    eventTime: "10.00 - 21.00 WITA",
    eventLocation: "Lapangan Terbuka Kampus",
    eventPoster: "/posters/culture-festival.jpg",
    ticketCode: "ETK-20261101-0012",
    ticketPrice: 0,
    status: "attended",
    registeredAt: "2026-10-28",
    attendedAt: "2026-11-01 10:15 WITA",
  },
];

// Pendaftaran Event oleh Mahasiswa
export const registerForEvent = async (params: {
  userId: string;
  userName: string;
  userEmail: string;
  userStudentId?: string;
  userPhone?: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventPoster?: string;
  ticketPrice?: number;
  status?: string;
  paymentStatus?: string;
}): Promise<{ registrationId: string; ticketCode: string }> => {
  const ticketCode = generateETicketCode();
  const registrationId = `reg-${Date.now()}`;
  const ticketId = `tkt-${Date.now()}`;

  const regData: Registration = {
    id: registrationId,
    registrationId,
    userId: params.userId,
    userName: params.userName,
    userEmail: params.userEmail,
    userStudentId: params.userStudentId || "230410021",
    userPhone: params.userPhone || "",
    eventId: params.eventId,
    eventTitle: params.eventTitle,
    eventDate: params.eventDate,
    eventTime: params.eventTime,
    eventLocation: params.eventLocation,
    eventPoster: params.eventPoster || "/posters/konser-kampus.jpg",
    ticketCode,
    ticketPrice: params.ticketPrice || 0,
    status: "confirmed",
    registeredAt: new Date().toISOString(),
  };

  const tktData: Ticket = {
    id: ticketId,
    ticketId,
    registrationId,
    userId: params.userId,
    userName: params.userName,
    userEmail: params.userEmail,
    userStudentId: params.userStudentId || "230410021",
    eventId: params.eventId,
    eventTitle: params.eventTitle,
    eventCategory: "Konser",
    eventPoster: params.eventPoster || "/posters/konser-kampus.jpg",
    eventDate: params.eventDate,
    eventTime: params.eventTime,
    eventLocation: params.eventLocation,
    ticketCode,
    qrCodeData: `${ticketCode}|${params.eventId}|${params.userStudentId || params.userId}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "registrations", registrationId), {
      ...regData,
      registeredAt: serverTimestamp(),
    });

    await setDoc(doc(db, "tickets", ticketId), {
      ...tktData,
      createdAt: serverTimestamp(),
    });

    // Tambah registeredCount pada event
    try {
      const eventRef = doc(db, "events", params.eventId);
      const evSnap = await getDoc(eventRef);
      if (evSnap.exists()) {
        const curCount = evSnap.data().registeredCount || 0;
        await updateDoc(eventRef, { registeredCount: curCount + 1 });
      }
    } catch (countErr) {
      console.warn("Gagal increment counter event:", countErr);
    }
  } catch (err) {
    console.warn("Gagal simpan pendaftaran di Firestore, fallback memory:", err);
  }

  DEFAULT_INITIAL_REGISTRATIONS.unshift(regData);

  return { registrationId, ticketCode };
};

// Mengambil seluruh pendaftaran milik user yang sedang login
export const getUserRegistrations = async (userId: string): Promise<Registration[]> => {
  try {
    const q = query(registrationsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
    }
  } catch (err) {
    console.warn("Firestore getUserRegistrations error:", err);
  }

  // Fallback demo
  return DEFAULT_INITIAL_REGISTRATIONS.filter(
    (r) => r.userId === userId || r.userId === "demo-user-id"
  );
};

// Mengambil seluruh pendaftaran peserta (Untuk Admin)
export const getAllRegistrations = async (): Promise<Registration[]> => {
  try {
    const snapshot = await getDocs(registrationsCollection);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
    }
  } catch (err) {
    console.warn("Firestore getAllRegistrations error:", err);
  }

  return DEFAULT_INITIAL_REGISTRATIONS;
};
