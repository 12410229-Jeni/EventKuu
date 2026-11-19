// ============================================================================
// EVENTKU - TYPESCRIPT TYPE DEFINITIONS
// Sesuai Ketentuan Dosen, Master Prompt, & Skema Firestore EventKu
// ============================================================================

// 8 Kategori Wajib EventKu (Campus & Faculty Day digabung sesuai ketentuan)
export type EventCategory =
  | "Sport"
  | "Festival"
  | "Campus & Faculty Day"
  | "Competition"
  | "Workshop"
  | "Teknologi"
  | "Game"
  | "Konser";

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

// Status Event Kampus
export type EventStatus =
  | "ongoing"    // Sedang Berlangsung
  | "upcoming"   // Akan Datang
  | "completed"  // Sudah Selesai
  | "published"  // Dipublikasikan (Aktif)
  | "draft"      // Draft Admin
  | "cancelled"; // Dibatalkan

// Status Pendaftaran Peserta
export type RegistrationStatus =
  | "confirmed"  // Terdaftar
  | "cancelled"  // Dibatalkan
  | "attended"   // Hadir / Selesai
  | "pending";   // Menunggu

// Status Tiket Digital
export type TicketStatus =
  | "active"     // Active (Belum digunakan)
  | "used"       // Used (Sudah dipakai / diverifikasi check-in)
  | "cancelled"; // Cancelled (Dibatalkan)

// Kategori Pengumuman Kampus
export type AnnouncementCategory =
  | "Event"
  | "Informasi"
  | "Penting";

export const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = [
  "Event",
  "Informasi",
  "Penting",
];

// Status Publikasi Pengumuman
export type AnnouncementStatus =
  | "draft"
  | "published";

// Role Pengguna (Strictly Student = 'user', Admin = 'admin')
export type UserRole = "user" | "admin";

// Data Profil Pengguna (Firestore: users/{uid})
export interface UserProfile {
  uid: string;
  fullName: string;
  name?: string; // alias
  email: string;
  role: UserRole;
  photoURL?: string;
  avatar?: string;
  studentId?: string; // NIM Mahasiswa (e.g. 230410021)
  faculty?: string;   // Fakultas / Program Studi
  phone?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Data Pembicara / Pengisi Acara
export interface EventSpeaker {
  name: string;
  role: string;
  avatar?: string;
  photoUrl?: string;
  bio?: string;
}

// Data Jadwal Rangkaian Acara
export interface EventScheduleItem {
  time: string;
  activity: string;
}

// Data Utama Event Kampus (Firestore: events/{eventId})
export interface Event {
  id: string;
  eventId?: string;
  title: string;          // Judul Event
  name: string;           // Alias nama event
  category: EventCategory;// 8 Kategori Wajib
  description: string;
  posterUrl: string;      // URL Poster di Firebase Storage / assets
  posterURL?: string;     // Alias
  date: string;           // Format ISO / tanggal (e.g. "2026-11-12")
  dateDisplay?: string;   // Format tampilan rapi (e.g. "12 Nov 2026")
  time: string;           // Format jam (e.g. "19.00 - 22.00 WITA")
  startTime?: string;
  endTime?: string;
  location: string;
  price: number;          // 0 = Gratis
  capacity: number;       // Kuota peserta
  quota: number;          // Alias kuota peserta
  registeredCount: number;// Jumlah peserta terdaftar
  status: EventStatus;
  organizer: string;      // Penyelenggara event
  contactPerson?: string;
  contactEmail?: string;
  registrationDeadline?: string;
  speakers?: EventSpeaker[];
  schedule?: EventScheduleItem[];
  createdAt?: any;
  updatedAt?: any;
}

export type EventItem = Event;

// Data Pendaftaran Mahasiswa (Firestore: registrations/{registrationId})
export interface Registration {
  id: string;
  registrationId?: string;
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
  ticketCode: string;     // Kode tiket unik (e.g. "ETK-20261112-0045")
  ticketPrice?: number;
  status: RegistrationStatus;
  paymentStatus?: string;
  registeredAt: any;
  attendedAt?: any;
}

// Data Tiket Digital Mahasiswa (Firestore: tickets/{ticketId})
export interface Ticket {
  id: string;
  ticketId: string;
  registrationId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userStudentId?: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventPoster?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  qrCodeData: string;     // String payload untuk QR code
  ticketCode: string;     // Format ETK-YYYYMMDD-XXXX
  status: TicketStatus;   // "active" | "used" | "cancelled"
  checkedInAt?: any;
  createdAt?: any;
}

// Data Pengumuman Kampus (Firestore: announcements/{announcementId})
export interface Announcement {
  id: string;
  announcementId?: string;
  title: string;
  category: AnnouncementCategory;
  summary: string;
  content: string;
  imageURL?: string;
  status: AnnouncementStatus;
  createdAt?: any;
  publishedAt?: any;
  createdBy?: string;
}

// Data Pesan Kontak (Firestore: contacts/{contactId})
export interface ContactMessage {
  id?: string;
  contactId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: any;
}

// Struktur Hasil dari LLM AI Announcement Generator
export interface GeneratedAnnouncement {
  title: string;
  category: AnnouncementCategory;
  summary: string;
  content: string;
  eventDetails?: string;
  callToAction?: string;
  fullText?: string;
}
