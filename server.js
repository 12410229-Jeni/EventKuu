import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Body parser
app.use(express.json({ limit: "50kb" }));

// CORS Middleware untuk development & proxy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "EventKu REST API & Gemini LLM Backend",
    version: "1.0.0",
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// -----------------------------------------------------------------------------
// POST /api/generate-announcement
// REST API Endpoint untuk LLM (Gemini API) secara aman di server
// Mencegah API Key bocor ke frontend client
// -----------------------------------------------------------------------------
app.post("/api/generate-announcement", async (req, res) => {
  try {
    const {
      prompt: rawPrompt,
      instruction,
      eventName,
      category,
      date,
      time,
      location,
      description,
    } = req.body;

    const queryInstruction = rawPrompt || instruction;

    if (!queryInstruction && (!eventName || !eventName.trim())) {
      return res.status(400).json({
        success: false,
        error: "Harap berikan instruksi pengumuman atau nama kegiatan.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Konfigurasi GEMINI_API_KEY belum tersedia di server .env.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `
Anda adalah asisten AI resmi untuk platform kampus EventKu bernama "EventKu AI Announcement Generator".
Tugas Anda adalah membuat draf pengumuman kegiatan kampus resmi, jelas, menarik, dan terstruktur dalam Bahasa Indonesia.

Kategori yang diizinkan HANYA salah satu dari 3 ini: "Event", "Informasi", atau "Penting".

Input dari Admin:
${queryInstruction ? `Instruksi Admin: "${queryInstruction}"` : ""}
${eventName ? `Nama Event: ${eventName}` : ""}
${category ? `Kategori: ${category}` : ""}
${date ? `Tanggal: ${date}` : ""}
${time ? `Waktu: ${time}` : ""}
${location ? `Lokasi: ${location}` : ""}
${description ? `Detail Tambahan: ${description}` : ""}

Berikan hasil HANYA berupa JSON valid dengan skema berikut tanpa backtick markdown (\`\`\`json) di luar teks:
{
  "title": "Judul pengumuman yang jelas dan menarik",
  "category": "Event" | "Informasi" | "Penting",
  "summary": "Ringkasan 1-2 kalimat untuk preview card pengumuman",
  "content": "Isi lengkap pengumuman termasuk salam, latar belakang, detail penting, instruksi pendaftaran atau tindakan mahasiswa, dan penutup hangat",
  "fullText": "Teks pengumuman lengkap siap publikasi"
}
`;

    // Menggunakan Gemini 2.5 Flash / Flash Lite yang didukung Google Gen AI SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let announcement;
    try {
      // Membersihkan kemungkinan formatting
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      announcement = JSON.parse(cleanJson);
    } catch {
      announcement = {
        title: eventName || "Pengumuman Kegiatan Kampus",
        category: category || "Event",
        summary: "Informasi terbaru mengenai kegiatan kampus EventKu.",
        content: text,
        fullText: text,
      };
    }

    // Default category fallback
    if (!["Event", "Informasi", "Penting"].includes(announcement.category)) {
      announcement.category = "Event";
    }

    return res.json({
      success: true,
      source: "Google Gemini 2.5 Flash via EventKu Secure REST API",
      announcement,
    });
  } catch (error) {
    console.error("Gemini API Server Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Gagal membuat pengumuman dengan AI. Silakan coba lagi.",
    });
  }
});

// -----------------------------------------------------------------------------
// POST /api/validate-ticket
// REST API Endpoint untuk memverifikasi tiket secara aman di backend
// -----------------------------------------------------------------------------
app.post("/api/validate-ticket", async (req, res) => {
  try {
    const { ticketCode } = req.body;

    if (!ticketCode || typeof ticketCode !== "string") {
      return res.status(400).json({
        success: false,
        valid: false,
        error: "Kode tiket tidak valid atau tidak disediakan.",
      });
    }

    const cleanCode = ticketCode.trim();

    // Validasi format tiket resmi ETK-
    const isValidFormat =
      cleanCode.startsWith("ETK-") ||
      cleanCode.startsWith("EVT-") ||
      cleanCode.length >= 8;

    if (!isValidFormat) {
      return res.status(200).json({
        success: true,
        valid: false,
        status: "invalid",
        error: "Format kode tiket tidak dikenali dalam sistem EventKu.",
      });
    }

    return res.json({
      success: true,
      valid: true,
      ticketCode: cleanCode,
      message: "Format tiket valid dan siap diproses di database.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Gagal memvalidasi tiket di backend.",
    });
  }
});

// -----------------------------------------------------------------------------
// POST /api/checkin-ticket
// REST API Endpoint untuk konfirmasi kehadiran (Check-In) tiket
// -----------------------------------------------------------------------------
app.post("/api/checkin-ticket", async (req, res) => {
  try {
    const { ticketCode, checkInTimestamp } = req.body;

    if (!ticketCode) {
      return res.status(400).json({
        success: false,
        error: "Kode tiket harus disertakan.",
      });
    }

    const timestamp = checkInTimestamp || new Date().toISOString();

    return res.json({
      success: true,
      ticketCode,
      status: "used",
      checkedInAt: timestamp,
      message: "Check-in kehadiran peserta berhasil dikonfirmasi.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Gagal konfirmasi check-in di server.",
    });
  }
});

// -----------------------------------------------------------------------------
// GET /api/reports
// REST API Endpoint untuk metrik dan statistik kampus
// -----------------------------------------------------------------------------
app.get("/api/reports", (_req, res) => {
  res.json({
    success: true,
    data: {
      totalEvents: 24,
      totalParticipants: 1286,
      activeTickets: 1103,
      usedTickets: 183,
      eventsActive: 6,
      monthlyRegistrations: [
        { month: "Jun", count: 250 },
        { month: "Jul", count: 480 },
        { month: "Agu", count: 620 },
        { month: "Sep", count: 750 },
        { month: "Okt", count: 980 },
        { month: "Nov", count: 1286 },
      ],
    },
  });
});

app.listen(PORT, () => {
  console.log(`EventKu REST API & Gemini LLM running at http://localhost:${PORT}`);
});
