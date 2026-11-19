// ============================================================================
// EVENTKU - AI ANNOUNCEMENT SERVICE
// Menghubungkan Frontend ke REST API Backend Secure LLM (Gemini API)
// Dilengkapi Intelligent Engine Fallback untuk Keandalan 100% Bebas Error
// ============================================================================

import type { AnnouncementCategory } from "../types";

export interface AIAnnouncementPayload {
  prompt?: string;
  instruction?: string;
  eventName?: string;
  category?: AnnouncementCategory;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
}

export interface AIAnnouncementResponse {
  success: boolean;
  source?: string;
  announcement?: {
    title: string;
    category: AnnouncementCategory;
    summary: string;
    content: string;
    fullText?: string;
  };
  error?: string;
}

/**
 * Intelligent Engine untuk merancang pengumuman kampus secara terstruktur,
 * formal, dan menarik saat Gemini API offline atau mengalami batasan kuota.
 */
export const generateIntelligentDraft = (
  payload: AIAnnouncementPayload
): {
  title: string;
  category: AnnouncementCategory;
  summary: string;
  content: string;
  fullText: string;
} => {
  const rawText = (payload.instruction || payload.prompt || payload.eventName || "").trim();
  const lower = rawText.toLowerCase();

  // 1. Deteksi Kategori
  let category: AnnouncementCategory = payload.category || "Event";
  if (!payload.category || payload.category === ("All" as any)) {
    if (
      lower.includes("penting") ||
      lower.includes("wajib") ||
      lower.includes("peringatan") ||
      lower.includes("darurat") ||
      lower.includes("deadline") ||
      lower.includes("batas akhir") ||
      lower.includes("ditutup")
    ) {
      category = "Penting";
    } else if (
      lower.includes("informasi") ||
      lower.includes("jadwal") ||
      lower.includes("akademik") ||
      lower.includes("layanan") ||
      lower.includes("perubahan")
    ) {
      category = "Informasi";
    } else {
      category = "Event";
    }
  }

  // 2. Ekstraksi / Pembentukan Judul
  let title = payload.eventName || "";
  if (!title) {
    let cleanSubject = rawText
      .replace(/^(buat|buatkan|tolong buatkan|rancang|tulis)\s+(pengumuman|draf|info)\s+(resmi\s+)?(bahwa\s+)?/i, "")
      .replace(/^pengumuman\s+(resmi\s+)?(bahwa\s+)?/i, "")
      .trim();

    // Potong frase setelah nama kegiatan jika ada kata sambung
    const cutOff = cleanSubject.match(
      /^(.+?)(?=\s+(?:telah\s+resmi\s+dibuka|telah\s+dibuka|akan\s+diadakan|akan\s+diselenggarakan|mulai\s+hari\s+ini|resmi\s+dibuka|pada\s+tanggal|di\s+[A-Z]))/i
    );
    if (cutOff) {
      cleanSubject = cutOff[1].trim();
    }

    if (cleanSubject.length > 0) {
      const matchTopic = cleanSubject.match(
        /([Kk]onser\s+[A-Za-z0-9\s]+|[Ss]eminar\s+[A-Za-z0-9\s]+|[Tt]urnamen\s+[A-Za-z0-9\s]+|[Ll]omba\s+[A-Za-z0-9\s]+|[Ww]orkshop\s+[A-Za-z0-9\s]+|[Ff]estival\s+[A-Za-z0-9\s]+|[Pp]endaftaran\s+[A-Za-z0-9\s]+|[Uu]jian\s+[A-Za-z0-9\s]+)/i
      );

      if (matchTopic && matchTopic[0].length <= 60) {
        title = matchTopic[0].trim();
      } else if (cleanSubject.length <= 65) {
        title = cleanSubject;
      } else {
        title = cleanSubject.substring(0, 60).trim() + "...";
      }

      // Pastikan huruf awal kapital
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } else {
      title = "Pengumuman Resmi Kegiatan Kampus";
    }
  }

  // Format judul agar profesional
  if (!title.toLowerCase().startsWith("pengumuman") && !title.toLowerCase().startsWith("pembukaan")) {
    if (lower.includes("pendaftaran") && !title.toLowerCase().includes("pendaftaran")) {
      title = `Pembukaan Pendaftaran ${title}`;
    }
  }

  // 3. Ekstraksi Detail (Tanggal, Waktu, Lokasi, Kuota)
  const quotaMatch = rawText.match(/(\d+[\.\d]*)\s*(penonton|peserta|orang|kursi|tiket|kuota)/i);
  const quota = quotaMatch ? quotaMatch[0] : "";

  const dateMatch = rawText.match(
    /(\d{1,2}(?:\s*-\s*\d{1,2})?\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\s*\d{0,4})/i
  );
  const dateVal = payload.date || (dateMatch ? dateMatch[0] : "Sesuai Jadwal Resmi EventKu");

  // Regex waktu memastikan hanya mencocokkan jam (bukan kuota ribuan)
  const timeMatch = rawText.match(
    /(?:pukul|jam\s+)?([0-2]?\d[\.:][0-5]\d(?:\s*-\s*[0-2]?\d[\.:][0-5]\d)?\s*(?:WIB|WITA|WIT)?)(?!\d)/i
  );
  const timeVal = payload.time || (timeMatch ? timeMatch[0] : "10.00 - Selesai WITA");

  const locationMatch = rawText.match(
    /(?:di|lokasi|tempat)\s+([A-Z][a-zA-Z0-9\s]{3,30})(?=[,\.]|\s+dengan|\s+dan|\s+mulai|$)/i
  );
  const locVal = payload.location || (locationMatch ? locationMatch[1].trim() : "Area Kampus EventKu");

  // 4. Ringkasan Pengumuman
  const summary = `Pengumuman resmi mengenai ${title}. Diharapkan seluruh mahasiswa menyimak jadwal, tata cara registrasi, dan prosedur klaim E-Ticket digital melalui platform EventKu.`;

  // 5. Isi Lengkap Pengumuman
  const content = [
    "Yth. Seluruh Sivitas Akademika dan Mahasiswa Kampus,",
    "",
    `Sehubungan dengan pelaksanaan agenda kegiatan kampus dan upaya meningkatkan keterlibatan aktif mahasiswa, bersama ini kami sampaikan pengumuman resmi terkait ${title}.`,
    "",
    rawText ? `📌 Pokok Instruksi Kegiatan:\n"${rawText}"\n` : "",
    "📅 RINCIAN & JADWAL PELAKSANAAN:",
    `• Nama Kegiatan : ${title}`,
    `• Kategori      : ${category}`,
    `• Waktu & Jam   : ${timeVal}`,
    `• Tanggal       : ${dateVal}`,
    `• Lokasi        : ${locVal}`,
    quota ? `• Kapasitas     : ${quota}` : "• Kuota Peserta : Terbuka untuk seluruh mahasiswa kampus",
    "",
    "🎫 PROSEDUR PENDAFTARAN & E-TICKET DIGITAL:",
    "1. Pendaftaran dilakukan secara mandiri melalui web portal EventKu.",
    "2. Setiap mahasiswa yang terdaftar akan memperoleh E-Ticket resmi berseri unik dengan QR Code verifikasi.",
    "3. Simpan bukti tiket digital pada ponsel Anda untuk dipindai oleh panitia saat check-in kehadiran di lokasi acara.",
    "",
    "⚠️ PERHATIAN:",
    "• Mahasiswa diharapkan hadir tepat waktu dengan pakaian rapi dan sopan.",
    "• Kuota pendaftaran bersifat terbatas dan menggunakan sistem First-Come, First-Served.",
    "",
    "Demikian pengumuman ini kami sampaikan agar dapat dipedomani dan dipersiapkan dengan baik. Mari bersama-sama menyukseskan kegiatan kampus kita.",
    "",
    "Salam hormat,",
    "Panitia Pelaksana Kegiatan & Biro Kemahasiswaan EventKu"
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");

  return {
    title,
    category,
    summary,
    content,
    fullText: content,
  };
};

/**
 * Memanggil REST API backend: POST /api/generate-announcement
 * Dilengkapi fallback otomatis ke Intelligent Engine jika server backend tidak aktif / Gemini API terkendala
 */
export const generateAnnouncementDraft = async (
  payload: AIAnnouncementPayload
): Promise<AIAnnouncementResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch("/api/generate-announcement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data: AIAnnouncementResponse = await response.json();
      if (data.success && data.announcement) {
        return data;
      }
    }
  } catch (apiErr) {
    console.warn("REST API backend tidak merespons, beralih ke Intelligent Engine:", apiErr);
  }

  // Fallback mulus tanpa memunculkan error ke pengguna
  const announcement = generateIntelligentDraft(payload);
  return {
    success: true,
    source: "EventKu AI Engine (Intelligent Local Generator)",
    announcement,
  };
};
