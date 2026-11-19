// ============================================================================
// EVENTKU - AI ANNOUNCEMENT SERVICE
// Menghubungkan Frontend ke REST API Backend Secure LLM (Gemini API)
// Sesuai Spesifikasi Keamanan: API Key tidak bocor ke client frontend
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
 * Memanggil REST API backend: POST /api/generate-announcement
 * Menjaga kerahasiaan GEMINI_API_KEY di server
 */
export const generateAnnouncementDraft = async (
  payload: AIAnnouncementPayload
): Promise<AIAnnouncementResponse> => {
  try {
    const response = await fetch("/api/generate-announcement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server HTTP Error: ${response.status}`);
    }

    const data: AIAnnouncementResponse = await response.json();
    return data;
  } catch (err: any) {
    console.error("AI Announcement Service Error:", err);
    return {
      success: false,
      error:
        err?.message ||
        "Gagal menghubungi server REST API EventKu AI. Pastikan server backend sedang berjalan.",
    };
  }
};
