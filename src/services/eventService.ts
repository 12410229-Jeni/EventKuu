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

// Data Awal 19 Event Kampus yang Lengkap Sesuai Poster Resmi & Kategori EventKu
export const DEFAULT_INITIAL_EVENTS: Event[] = [
  // ===========================================================================
  // 1. SEDANG BERLANGSUNG (ONGOING)
  // ===========================================================================
  {
    id: "evt-game-fest-2026",
    eventId: "evt-game-fest-2026",
    title: "Campus Game Fest 2026",
    name: "Campus Game Fest 2026",
    category: "Game",
    description: "Turnamen esport antar fakultas terbesar di kampus! Kompetisi Mobile Legends, Valorant, dan FIFA dengan total hadiah jutaan rupiah serta merchandise eksklusif EventKu.",
    posterUrl: "/assets/posters/game-fest.jpg",
    posterURL: "/assets/posters/game-fest.jpg",
    date: "2026-11-10",
    dateDisplay: "10 - 14 Nov 2026",
    time: "10.00 - 18.00 WITA",
    startTime: "10:00",
    endTime: "18:00",
    location: "Lab Multimedia Kampus",
    price: 0,
    capacity: 200,
    quota: 200,
    registeredCount: 185,
    status: "ongoing",
    organizer: "BEM Fakultas Ilmu Komputer",
    contactPerson: "Aldo Pratama",
    contactEmail: "gamefest@campus.edu",
    registrationDeadline: "2026-11-09",
    speakers: [{ name: "Aldo Pratama", role: "Ketua Panitia Esport" }],
    schedule: [{ time: "10:00", activity: "Opening Match Mobile Legends & Valorant" }],
  },
  {
    id: "evt-turnamen-basket-2026",
    eventId: "evt-turnamen-basket-2026",
    title: "Turnamen Basket Campus League",
    name: "Turnamen Basket Campus League",
    category: "Sport",
    description: "Liga basket bergengsi antar mahasiswa dan program studi. Tunjukkan sportivitas dan dukung tim fakultasmu menuju gelar juara musim gugur ini!",
    posterUrl: "/assets/posters/turnamen-basket.jpg",
    posterURL: "/assets/posters/turnamen-basket.jpg",
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
    posterUrl: "/assets/posters/seminar-teknologi.jpg",
    posterURL: "/assets/posters/seminar-teknologi.jpg",
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
    id: "evt-campus-movie-night-2026",
    eventId: "evt-campus-movie-night-2026",
    title: "Campus Movie Night",
    name: "Campus Movie Night",
    category: "Festival",
    description: "Nikmati malam santai bersama teman-teman kampus dengan pemutaran film inspiratif, aksesoris seru, dan suasana outdoor yang nyaman. Tersedia popcorn dan minuman gratis!",
    posterUrl: "/assets/posters/campus-movie-night.jpg",
    posterURL: "/assets/posters/campus-movie-night.jpg",
    date: "2026-11-15",
    dateDisplay: "Sab, 15 Nov 2026",
    time: "19.00 - 21.30 WITA",
    startTime: "19:00",
    endTime: "21:30",
    location: "Lawn Kampus A (Outdoor)",
    price: 0,
    capacity: 300,
    quota: 300,
    registeredCount: 260,
    status: "ongoing",
    organizer: "BEM Universitas & UKM Sinematografi",
    contactPerson: "Dimas Anggara",
    contactEmail: "movienight@campus.edu",
    registrationDeadline: "2026-11-14",
    speakers: [{ name: "Sutradara Muda Tamu", role: "Sesi Diskusi Film" }],
    schedule: [{ time: "19:00", activity: "Pemutaran Film & Diskusi Sinema" }],
  },
  {
    id: "evt-book-fair-2026",
    eventId: "evt-book-fair-2026",
    title: "Campus Book Fair & Literacy Day",
    name: "Campus Book Fair & Literacy Day",
    category: "Festival",
    description: "Jelajahi dunia literasi, temukan ribuan buku diskon spesial, ikuti Book Exchange, Literacy Corner, dan diskusi buku bersama penulis dan akademisi inspiratif.",
    posterUrl: "/assets/posters/book-fair.jpg",
    posterURL: "/assets/posters/book-fair.jpg",
    date: "2026-11-16",
    dateDisplay: "16 - 17 Nov 2026",
    time: "09.00 - 16.00 WITA",
    startTime: "09:00",
    endTime: "16:00",
    location: "Plaza Kampus",
    price: 0,
    capacity: 400,
    quota: 400,
    registeredCount: 310,
    status: "ongoing",
    organizer: "Departemen Akademik BEM",
    contactPerson: "Lia Safitri",
    contactEmail: "bookfair@campus.edu",
    registrationDeadline: "2026-11-15",
    speakers: [{ name: "Penulis Buku Nasional", role: "Bedah Buku & Literasi" }],
    schedule: [{ time: "09:00", activity: "Pameran Buku & Lapak Book Exchange" }],
  },
  {
    id: "evt-career-fair-2026",
    eventId: "evt-career-fair-2026",
    title: "Campus Career Fair 2026",
    name: "Campus Career Fair 2026",
    category: "Campus & Faculty Day",
    description: "Pameran karier akbar yang menghadirkan puluhan perusahaan mitra, peluang magang, job expo, review CV & portofolio gratis, serta sharing session bersama praktisi industri.",
    posterUrl: "/assets/posters/career-fair.jpg",
    posterURL: "/assets/posters/career-fair.jpg",
    date: "2026-11-15",
    dateDisplay: "Sab, 15 Nov 2026",
    time: "09.00 - 16.00 WITA",
    startTime: "09:00",
    endTime: "16:00",
    location: "Auditorium Kampus A",
    price: 0,
    capacity: 650,
    quota: 650,
    registeredCount: 540,
    status: "ongoing",
    organizer: "Pusat Pengembangan Karier Mahasiswa",
    contactPerson: "Andi Wijaya, M.Psi",
    contactEmail: "career@campus.edu",
    registrationDeadline: "2026-11-14",
    speakers: [{ name: "HR Director Tech Startup", role: "Tips Lolos Interview" }],
    schedule: [{ time: "09:00", activity: "Walk-in Interview & CV Review Booth" }],
  },

  // ===========================================================================
  // 2. SUDAH SELESAI (COMPLETED)
  // ===========================================================================
  {
    id: "evt-u-sport-fest-2026",
    eventId: "evt-u-sport-fest-2026",
    title: "U-Sport Fest 2026",
    name: "U-Sport Fest 2026",
    category: "Sport",
    description: "Pesta olahraga akbar antar fakultas mempererat sportivitas mahasiswa! Kompetisi Basket, Voli, Futsal, dan Tenis Meja dengan partisipasi ratusan atlet mahasiswa kampus.",
    posterUrl: "/assets/posters/u-sport-fest.jpg",
    posterURL: "/assets/posters/u-sport-fest.jpg",
    date: "2026-10-31",
    dateDisplay: "06 - 31 Okt 2026",
    time: "07.30 - 17.00 WITA",
    startTime: "07:30",
    endTime: "17:00",
    location: "Sporthall Kampus",
    price: 0,
    capacity: 450,
    quota: 450,
    registeredCount: 450,
    status: "completed",
    organizer: "Departemen Olahraga BEM",
    contactPerson: "Valen & Uta",
    contactEmail: "sportfest@campus.edu",
    registrationDeadline: "2026-10-03",
    speakers: [{ name: "Ketua BEM", role: "Penutupan & Penyerahan Medali" }],
    schedule: [{ time: "08:00", activity: "Grand Final Semua Cabang Olahraga" }],
  },
  {
    id: "evt-culture-fest-2026",
    eventId: "evt-culture-fest-2026",
    title: "Campus Culture & Art Festival",
    name: "Campus Culture & Art Festival",
    category: "Festival",
    description: "Festival seni dan budaya tahunan mahasiswa dengan pameran lukisan, pertunjukan teater, karnaval pakaian adat nusantara, dan workshop kerajinan tangan.",
    posterUrl: "/assets/posters/culture-festival.jpg",
    posterURL: "/assets/posters/culture-festival.jpg",
    date: "2026-11-01",
    dateDisplay: "01 - 03 Nov 2026",
    time: "10.00 - 21.00 WITA",
    startTime: "10:00",
    endTime: "21:00",
    location: "Main Campus Courtyard",
    price: 0,
    capacity: 600,
    quota: 600,
    registeredCount: 580,
    status: "completed",
    organizer: "Dewan Kesenian Mahasiswa",
    contactPerson: "Larasati",
    contactEmail: "culturefest@campus.edu",
    registrationDeadline: "2026-10-30",
    speakers: [{ name: "Koreografer Tari Tradisional", role: "Juri Pentas Budaya" }],
    schedule: [{ time: "15:00", activity: "Parade Karnaval Budaya Nusantara" }],
  },
  {
    id: "evt-mini-job-fair-2026",
    eventId: "evt-mini-job-fair-2026",
    title: "Campus Mini Job & Internship Fair",
    name: "Campus Mini Job & Internship Fair",
    category: "Campus & Faculty Day",
    description: "Pameran karier terfokus yang mempertemukan mahasiswa dengan berbagai mitra perusahaan untuk menjajaki lowongan kerja, magang bersertifikat, dan konsultasi karier.",
    posterUrl: "/assets/posters/mini-job-fair.jpg",
    posterURL: "/assets/posters/mini-job-fair.jpg",
    date: "2026-11-10",
    dateDisplay: "Sel, 10 Nov 2026",
    time: "09.00 - 16.00 WITA",
    startTime: "09:00",
    endTime: "16:00",
    location: "Sporthall Kampus",
    price: 0,
    capacity: 400,
    quota: 400,
    registeredCount: 395,
    status: "completed",
    organizer: "Career Development & Alumni Center",
    contactPerson: "Tim CDC Kampus",
    contactEmail: "cdc@campus.edu",
    registrationDeadline: "2026-11-08",
    speakers: [{ name: "Konsultan Rekrutmen", role: "Sesi Coaching Magang" }],
    schedule: [{ time: "09:00", activity: "Booth Interview Perusahaan Mitra" }],
  },
  {
    id: "evt-talent-show-2026",
    eventId: "evt-talent-show-2026",
    title: "Campus Talent Show 2026",
    name: "Campus Talent Show 2026",
    category: "Competition",
    description: "Panggung bakat mahasiswa bergengsi: kompetisi solo vokal, tari modern, penampilan band akustik, pertunjukan drama, dan bakat unik mahasiswa berhadiah trofi dan sertifikat.",
    posterUrl: "/assets/posters/talent-show.jpg",
    posterURL: "/assets/posters/talent-show.jpg",
    date: "2026-02-20",
    dateDisplay: "Jum, 20 Feb 2026",
    time: "18.00 - 22.00 WITA",
    startTime: "18:00",
    endTime: "22:00",
    location: "Aula Universitas",
    price: 0,
    capacity: 500,
    quota: 500,
    registeredCount: 490,
    status: "completed",
    organizer: "BEM Universitas & UKM Seni Pertunjukan",
    contactPerson: "Natasya Putri",
    contactEmail: "talentshow@campus.edu",
    registrationDeadline: "2026-02-15",
    speakers: [{ name: "Juri Musisi Profesional", role: "Dewan Juri Utama" }],
    schedule: [{ time: "18:00", activity: "Malam Grand Final Panggung Bakat" }],
  },
  {
    id: "evt-techfest-competition-2026",
    eventId: "evt-techfest-competition-2026",
    title: "TechFest 2026: Code & Innovate",
    name: "TechFest 2026: Code & Innovate",
    category: "Competition",
    description: "Kompetisi teknologi dan hackathon tahunan mahasiswa: UI/UX Design, Web Development, Data Analytics, dan Game Development dengan total hadiah jutaan rupiah dan sertifikat resmi.",
    posterUrl: "/assets/posters/techfest-poster.jpg",
    posterURL: "/assets/posters/techfest-poster.jpg",
    date: "2026-01-17",
    dateDisplay: "15 - 17 Jan 2026",
    time: "09.00 - 17.00 WITA",
    startTime: "09:00",
    endTime: "17:00",
    location: "Auditorium Kampus A",
    price: 0,
    capacity: 300,
    quota: 300,
    registeredCount: 295,
    status: "completed",
    organizer: "BEM Fakultas Ilmu Komputer",
    contactPerson: "Fajar Nugraha",
    contactEmail: "techfest@campus.edu",
    registrationDeadline: "2026-01-10",
    speakers: [{ name: "Senior Software Engineer", role: "Juri Hackathon" }],
    schedule: [{ time: "09:00", activity: "Presentasi Karya Finalis & Pameran Inovasi" }],
  },

  // ===========================================================================
  // 3. AKAN DATANG (UPCOMING)
  // ===========================================================================
  {
    id: "evt-futsal-cup-2026",
    eventId: "evt-futsal-cup-2026",
    title: "Interfaculty Futsal Cup 2026",
    name: "Interfaculty Futsal Cup 2026",
    category: "Sport",
    description: "Turnamen futsal bergengsi antar fakultas dengan perebutan piala bergilir kejuaraan olahraga kampus, medali emas, dan hadiah jutaan rupiah. Daftarkan tim fakultasmu sekarang!",
    posterUrl: "/assets/posters/futsal-cup.jpg",
    posterURL: "/assets/posters/futsal-cup.jpg",
    date: "2026-12-20",
    dateDisplay: "Min, 20 Des 2026",
    time: "08.00 - 17.00 WITA",
    startTime: "08:00",
    endTime: "17:00",
    location: "Campus Sports Hall",
    price: 0,
    capacity: 300,
    quota: 300,
    registeredCount: 142,
    status: "upcoming",
    organizer: "UKM Futsal Kampus",
    contactPerson: "Rangga Pratama",
    contactEmail: "futsalcup@campus.edu",
    registrationDeadline: "2026-12-15",
    speakers: [{ name: "Wasit Futsal Berlisensi", role: "Koordinator Pertandingan" }],
    schedule: [{ time: "08:00", activity: "Kick-off Babak Penyisihan Antar Fakultas" }],
  },
  {
    id: "evt-leadership-summit-2026",
    eventId: "evt-leadership-summit-2026",
    title: "Campus Leadership Summit 2026",
    name: "Campus Leadership Summit 2026",
    category: "Workshop",
    description: "Simposium kepemimpinan mahasiswa: empowering student leaders for a greater campus impact. Pelajari public speaking, manajemen tim strategis, dan diplomasi organisasi.",
    posterUrl: "/assets/posters/leadership-summit.jpg",
    posterURL: "/assets/posters/leadership-summit.jpg",
    date: "2026-12-12",
    dateDisplay: "Sab, 12 Des 2026",
    time: "09.00 - 15.00 WITA",
    startTime: "09:00",
    endTime: "15:00",
    location: "Auditorium Universitas",
    price: 0,
    capacity: 250,
    quota: 250,
    registeredCount: 165,
    status: "upcoming",
    organizer: "BEM Universitas & Biro Kepemimpinan Mahasiswa",
    contactPerson: "Aditya Wardhana",
    contactEmail: "leadership@campus.edu",
    registrationDeadline: "2026-12-08",
    speakers: [{ name: "Tokoh Pemimpin Muda Nasional", role: "Keynote Speaker" }],
    schedule: [{ time: "09:00", activity: "Sesi Kepemimpinan Adaptif & Simulasi Organisasi" }],
  },
  {
    id: "evt-creative-media-workshop-2027",
    eventId: "evt-creative-media-workshop-2027",
    title: "Creative Media Workshop 2027",
    name: "Creative Media Workshop 2027",
    category: "Workshop",
    description: "Pelatihan intensif multimedia kreatif: digital photography, cinematic video production, UI/UX prototyping di Figma, serta teknik color grading profesional.",
    posterUrl: "/assets/posters/creative-media.jpg",
    posterURL: "/assets/posters/creative-media.jpg",
    date: "2027-01-08",
    dateDisplay: "Jum, 08 Jan 2027",
    time: "10.00 - 16.00 WITA",
    startTime: "10:00",
    endTime: "16:00",
    location: "Creative Lab Campus",
    price: 0,
    capacity: 120,
    quota: 120,
    registeredCount: 78,
    status: "upcoming",
    organizer: "Creative Media Club",
    contactPerson: "Dian Anggraini",
    contactEmail: "creativemedia@campus.edu",
    registrationDeadline: "2027-01-05",
    speakers: [{ name: "Creative Director Agensi", role: "Instruktur Workshop" }],
    schedule: [{ time: "10:00", activity: "Hands-on Practice Desain & Produksi Video" }],
  },
  {
    id: "evt-techfest-exhibition-2027",
    eventId: "evt-techfest-exhibition-2027",
    title: "TechFest Exhibition & Innovation Demo",
    name: "TechFest Exhibition & Innovation Demo",
    category: "Teknologi",
    description: "Showcase inovasi teknologi masa depan: demonstrasi Virtual Reality headset, robotika pintar, Internet of Things, dan implementasi kecerdasan buatan di era modern.",
    posterUrl: "/assets/posters/techfest-alt.jpg",
    posterURL: "/assets/posters/techfest-alt.jpg",
    date: "2027-01-16",
    dateDisplay: "15 - 17 Jan 2027",
    time: "09.00 - 17.00 WITA",
    startTime: "09:00",
    endTime: "17:00",
    location: "Auditorium Kampus A",
    price: 0,
    capacity: 450,
    quota: 450,
    registeredCount: 210,
    status: "upcoming",
    organizer: "Fakultas Ilmu Komputer",
    contactPerson: "Surya Gemilang",
    contactEmail: "techexpo@campus.edu",
    registrationDeadline: "2027-01-12",
    speakers: [{ name: "VR & Robotics Researcher", role: "Demonstrator Booth" }],
    schedule: [{ time: "09:00", activity: "Interaktif VR Demo & Pameran Hardware AI" }],
  },
  {
    id: "evt-research-colloquium-2027",
    eventId: "evt-research-colloquium-2027",
    title: "Student Research Colloquium",
    name: "Student Research Colloquium",
    category: "Workshop",
    description: "Forum pemaparan hasil riset, inovasi terapan, dan publikasi ilmiah mahasiswa. Diskusi lintas fakultas bersama dosen pembimbing dan reviewer ahli kampus.",
    posterUrl: "/assets/posters/research-colloquium.jpg",
    posterURL: "/assets/posters/research-colloquium.jpg",
    date: "2027-01-22",
    dateDisplay: "Jum, 22 Jan 2027",
    time: "13.00 - 17.00 WITA",
    startTime: "13:00",
    endTime: "17:00",
    location: "University Conference Room",
    price: 0,
    capacity: 180,
    quota: 180,
    registeredCount: 115,
    status: "upcoming",
    organizer: "Lembaga Penelitian & Pengabdian Mahasiswa",
    contactPerson: "Dr. Maya Indriani",
    contactEmail: "research@campus.edu",
    registrationDeadline: "2027-01-18",
    speakers: [{ name: "Prof. Dr. Ir. Gunawan", role: "Keynote Academic Forum" }],
    schedule: [{ time: "13:00", activity: "Sesi Presentasi Paper Riset Mahasiswa" }],
  },
  {
    id: "evt-konser-kampus-2027",
    eventId: "evt-konser-kampus-2027",
    title: "Konser Kampus 2027",
    name: "Konser Kampus 2027",
    category: "Konser",
    description: "Malam puncak festival musik mahasiswa dengan penampilan bintang tamu nasional, band kampus favorit, bazaar kuliner malam, dan pesta kembang api spektakuler.",
    posterUrl: "/assets/posters/konser-kampus.jpg",
    posterURL: "/assets/posters/konser-kampus.jpg",
    date: "2027-01-30",
    dateDisplay: "Jum, 30 Jan 2027",
    time: "19.00 - 22.00 WITA",
    startTime: "19:00",
    endTime: "22:00",
    location: "Lapangan Utama Kampus",
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
    schedule: [{ time: "19:00", activity: "Opening Act & Penampilan Band Kampus" }],
  },
  {
    id: "evt-debate-competition-2027",
    eventId: "evt-debate-competition-2027",
    title: "Interfaculty Debate Open Competition",
    name: "Interfaculty Debate Open Competition",
    category: "Competition",
    description: "Kompetisi debat ilmiah mahasiswa tingkat nasional dengan tema 'Inovasi Digital dan Kebijakan Publik untuk Masa Depan Berkelanjutan'. Daftarkan tim debat terbaik fakultasmu!",
    posterUrl: "/assets/posters/debate-open.jpg",
    posterURL: "/assets/posters/debate-open.jpg",
    date: "2027-02-19",
    dateDisplay: "Jum, 19 Feb 2027",
    time: "09.00 - 17.00 WITA",
    startTime: "09:00",
    endTime: "17:00",
    location: "Student Activity Center",
    price: 0,
    capacity: 150,
    quota: 150,
    registeredCount: 96,
    status: "upcoming",
    organizer: "UKM English & Scientific Debate",
    contactPerson: "Farhan Hakim",
    contactEmail: "debate@campus.edu",
    registrationDeadline: "2027-02-15",
    speakers: [{ name: "Adjudicator Debat Nasional", role: "Ketua Dewan Juri" }],
    schedule: [{ time: "09:00", activity: "Babak Penyisihan & Babak Gugur Debat" }],
  },
  {
    id: "evt-campus-day-2027",
    eventId: "evt-campus-day-2027",
    title: "Campus & Faculty Day 2027",
    name: "Campus & Faculty Day 2027",
    category: "Campus & Faculty Day",
    description: "Perayaan tahunan seluruh fakultas kampus! Pameran inovasi riset, pentas tari budaya nusantara, stan kewirausahaan mahasiswa, dan games interaktif terbuka untuk seluruh sivitas akademika.",
    posterUrl: "/assets/posters/campus-day.jpg",
    posterURL: "/assets/posters/campus-day.jpg",
    date: "2027-04-24",
    dateDisplay: "Sab, 24 Apr 2027",
    time: "09.00 - 16.00 WITA",
    startTime: "09:00",
    endTime: "16:00",
    location: "Area Terpadu Kampus",
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
];

// Helper normalisasi dokumen Firestore ke interface Event
const mapDocToEvent = (docId: string, d: any): Event => {
  const title = d.title || d.name || "Event Kampus";
  const quota = typeof d.quota === "number" ? d.quota : (typeof d.capacity === "number" ? d.capacity : 100);
  const poster = d.posterUrl || d.posterURL || "/assets/posters/techfest-poster.jpg";
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
  const poster = eventData.posterUrl || eventData.posterURL || "/assets/posters/techfest-poster.jpg";

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
    id: "reg-konser-mhs",
    registrationId: "reg-konser-mhs",
    userId: "TqTguaY3sxeFkwwhMyUq2XUbIKo1",
    userName: "Mahasiswa EventKu",
    userEmail: "mahasiswa.eventku@example.com",
    userStudentId: "230410021",
    userPhone: "081234567890",
    eventId: "evt-konser-kampus-2027",
    eventTitle: "Konser Kampus 2027",
    eventDate: "12 Nov 2026",
    eventTime: "19.00 - 22.00 WITA",
    eventLocation: "Lapangan Kampus",
    eventPoster: "/assets/posters/konser-kampus.jpg",
    ticketCode: "ETK-20261112-0045",
    ticketPrice: 0,
    status: "confirmed",
    registeredAt: "2026-11-05",
  },
  {
    id: "reg-basket-mhs",
    registrationId: "reg-basket-mhs",
    userId: "TqTguaY3sxeFkwwhMyUq2XUbIKo1",
    userName: "Mahasiswa EventKu",
    userEmail: "mahasiswa.eventku@example.com",
    userStudentId: "230410021",
    userPhone: "081234567890",
    eventId: "evt-turnamen-basket-2026",
    eventTitle: "Turnamen Basket Campus League",
    eventDate: "12 - 18 Nov 2026",
    eventTime: "14.00 - 18.00 WITA",
    eventLocation: "Sport Center Kampus",
    eventPoster: "/assets/posters/turnamen-basket.jpg",
    ticketCode: "ETK-20261112-0089",
    ticketPrice: 0,
    status: "confirmed",
    registeredAt: "2026-11-06",
  },
  {
    id: "reg-culture-mhs",
    registrationId: "reg-culture-mhs",
    userId: "TqTguaY3sxeFkwwhMyUq2XUbIKo1",
    userName: "Mahasiswa EventKu",
    userEmail: "mahasiswa.eventku@example.com",
    userStudentId: "230410021",
    userPhone: "081234567890",
    eventId: "evt-culture-fest-2026",
    eventTitle: "Campus Culture & Art Festival",
    eventDate: "01 - 03 Nov 2026",
    eventTime: "10.00 - 21.00 WITA",
    eventLocation: "Lapangan Terbuka Kampus",
    eventPoster: "/assets/posters/culture-festival.jpg",
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
    eventPoster: params.eventPoster || "/assets/posters/techfest-poster.jpg",
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
    eventPoster: params.eventPoster || "/assets/posters/techfest-poster.jpg",
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

  // Filter pendaftaran sesuai userId pengguna yang login
  return DEFAULT_INITIAL_REGISTRATIONS.filter(
    (r) => r.userId === userId
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
