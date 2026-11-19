import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import type { UserProfile } from "../types";

// Mengambil seluruh pengguna dari Firestore
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map((userDoc) => {
      const data = userDoc.data();

      return {
        uid: data.uid || userDoc.id,
        fullName: data.fullName || data.name || "Pengguna",
        email: data.email || "",
        role: data.role === "admin" ? "admin" : "user",
        createdAt: data.createdAt || null,
        phone: data.phone || "",
        avatar: data.avatar || "",
        studentId: data.studentId || "",
        faculty: data.faculty || "",
      };
    });
  } catch (error) {
    console.error("Error mengambil data pengguna:", error);
    return [];
  }
};

// Memperbarui profil tanpa mengubah role
export const updateUserProfile = async (
  uid: string,
  data: {
    fullName?: string;
    studentId?: string;
    faculty?: string;
    phone?: string;
    avatar?: string;
  }
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const updatePayload: Record<string, string> = {};

    if (data.fullName !== undefined) {
      updatePayload.fullName = data.fullName.trim();
    }

    if (data.studentId !== undefined) {
      updatePayload.studentId = data.studentId.trim();
    }

    if (data.faculty !== undefined) {
      updatePayload.faculty = data.faculty.trim();
    }

    if (data.phone !== undefined) {
      updatePayload.phone = data.phone.trim();
    }

    if (data.avatar !== undefined) {
      updatePayload.avatar = data.avatar;
    }

    if (Object.keys(updatePayload).length > 0) {
      await updateDoc(userDocRef, updatePayload);
    }
  } catch (error) {
    console.error("Error memperbarui profil:", error);
    throw error;
  }
};

// Memperbarui role pengguna
export const updateUserRole = async (
  uid: string,
  newRole: "user" | "admin"
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", uid);

    await updateDoc(userDocRef, {
      role: newRole,
    });
  } catch (error) {
    console.error("Error memperbarui role pengguna:", error);
    throw error;
  }
};

// Mengubah role pengguna menjadi admin
export const promoteUserToAdmin = async (
  uid: string
): Promise<void> => {
  return updateUserRole(uid, "admin");
};

// Mengambil satu profil pengguna
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      uid: data.uid || uid,
      fullName: data.fullName || data.name || "Pengguna",
      email: data.email || "",
      role: data.role === "admin" ? "admin" : "user",
      createdAt: data.createdAt || null,
      phone: data.phone || "",
      avatar: data.avatar || "",
      studentId: data.studentId || "",
      faculty: data.faculty || "",
    };
  } catch (error) {
    console.error("Error mengambil profil pengguna:", error);
    return null;
  }
};