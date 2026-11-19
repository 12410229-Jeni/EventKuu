// ============================================================================
// EVENTKU - CONTACT SERVICE
// Pengelolaan Formulir Kontak Peserta & Sivitas Akademika
// ============================================================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import type { ContactMessage } from "../types";

const contactsCollection = collection(db, "contacts");

export const sendContactMessage = async (
  messageData: Omit<ContactMessage, "id" | "createdAt">
): Promise<string> => {
  const payload = {
    ...messageData,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(contactsCollection, payload);
    return docRef.id;
  } catch (error) {
    console.warn("Gagal simpan pesan kontak ke Firestore, fallback memory:", error);
    return `contact-${Date.now()}`;
  }
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const snapshot = await getDocs(
      query(contactsCollection, orderBy("createdAt", "desc"))
    );
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        contactId: d.id,
        ...(d.data() as any),
      }));
    }
  } catch (error) {
    console.warn("Membaca Firestore contact messages:", error);
  }
  return [];
};
