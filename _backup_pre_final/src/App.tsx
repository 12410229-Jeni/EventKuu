import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import ExploreEventsPage from "./pages/ExploreEventsPage";
import CategoriesPage from "./pages/CategoriesPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AnnouncementDetailsPage from "./pages/AnnouncementDetailsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Authentication Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Student Dashboard (Includes Registrations, E-Tickets, Profile)
import UserDashboardPage from "./pages/UserDashboardPage";

// Admin Dashboard (Includes Manage Events, Participants, Announcements, Reports, Settings)
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminScanPage from "./pages/AdminScanPage";
import AIAnnouncementPage from "./pages/AIAnnouncementPage";

import "./App.css";

// Layout utama
function Layout() {
  const location = useLocation();

  // Navbar dan Footer disembunyikan pada halaman autentikasi
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="app-shell">
      <ScrollToTop />

      {!isAuthPage && <Navbar />}

      <main className="main-content-area">
        <Routes>
          {/* PAGE 01 — Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* PAGE 02 — Explore Events */}
          <Route path="/events" element={<ExploreEventsPage />} />

          {/* PAGE 03 — Categories */}
          <Route path="/categories" element={<CategoriesPage />} />

          {/* PAGE 04 — Event Details */}
          <Route path="/events/:id" element={<EventDetailsPage />} />

          {/* Event Registration */}
          <Route
            path="/events/:id/register"
            element={
              <ProtectedRoute>
                <EventRegistrationPage />
              </ProtectedRoute>
            }
          />

          {/* PAGE 05 — Announcements */}
          <Route path="/announcements" element={<AnnouncementsPage />} />

          {/* PAGE 06 — Announcement Details */}
          <Route path="/announcements/:id" element={<AnnouncementDetailsPage />} />

          {/* PAGE 07 — About */}
          <Route path="/about" element={<AboutPage />} />

          {/* PAGE 08 — Contact */}
          <Route path="/contact" element={<ContactPage />} />

          {/* PAGE 09 — Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* PAGE 10 — Register */}
          <Route path="/register" element={<RegisterPage />} />

          {/* PAGE 11, 12, 13, 14 — Student Dashboard, My Registrations, My E-Tickets, Profile */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* PAGE 15, 16, 17, 19, 21, 22 — Admin Dashboard, Manage Events, Participants, Announcements, Reports, Settings */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          {/* PAGE 18 — Admin QR Scanner */}
          <Route
            path="/admin/scan"
            element={
              <AdminRoute>
                <AdminScanPage />
              </AdminRoute>
            }
          />

          {/* PAGE 20 — Admin AI Announcement Generator */}
          <Route
            path="/admin/ai-announcement"
            element={
              <AdminRoute>
                <AIAnnouncementPage />
              </AdminRoute>
            }
          />

          {/* Halaman tidak ditemukan */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

// Main App
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
