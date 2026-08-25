import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// ── Auth pages ────────────────────────────────────────────────────────────────
import HomePage from './pages/Home';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import VerifyEmailPage from './pages/auth/VerifyEmail';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import AuthCallbackPage from './pages/auth/AuthCallback';

// ── Directory (merged /alumni + /students) ────────────────────────────────────
import DirectoryPage from './pages/directory/DirectoryPage';

// ── Profile (unified via AlumniProfile) ──────────────────────────────────────
import AlumniProfilePage from './pages/alumni/AlumniProfile';
import ProfilePage from './pages/profile/Profile';
import EditProfilePage from './pages/profile/EditProfile';

// ── Community ─────────────────────────────────────────────────────────────────
import FeedPage from './pages/community/Feed';

// ── Jobs ──────────────────────────────────────────────────────────────────────
import JobsPage from './pages/jobs/Jobs';
import PostJobPage from './pages/jobs/PostJob';
import JobDetailPage from './pages/jobs/JobDetail';

// ── Events ────────────────────────────────────────────────────────────────────
import EventsPage from './pages/events/Events';
import CreateEventPage from './pages/events/CreateEvent';
import EventDetailPage from './pages/events/EventDetail';

// ── Mentorship ────────────────────────────────────────────────────────────────
import MentorshipPage from './pages/mentorship/Mentorship';
import MentorshipDetailPage from './pages/mentorship/MentorshipDetail';

// ── Stories (merged /stories + /legacy) ──────────────────────────────────────
import StoriesPage from './pages/stories/StoriesPage';
import StoryDetailPage from './pages/stories/StoryDetail';
import CreateStoryPage from './pages/stories/CreateStory';

// ── Analytics (admin-gated global view) ──────────────────────────────────────
import AnalyticsPage from './pages/analytics/Analytics';

// ── Admin ─────────────────────────────────────────────────────────────────────
import AdminPage from './pages/admin/Admin';

// ── Other ─────────────────────────────────────────────────────────────────────
import MessagesPage from './pages/messages/Messages';
import NotificationsPage from './pages/notifications/Notifications';
import ResearchPage from './pages/research/Research';
import StartupEcosystemPage from './pages/startups/StartupEcosystem';
import OnboardingPage from './pages/onboarding/Onboarding';
import NotFoundPage from './pages/NotFound';

// ── Institute (verified IITRAM institutional information) ───────────────────
import InstituteLayout from './pages/institute/InstituteLayout';
import InstituteIndexPage from './pages/institute/InstituteIndexPage';
import AboutPage from './pages/institute/AboutPage';
import AcademicsPage from './pages/institute/AcademicsPage';
import DepartmentsPage from './pages/institute/DepartmentsPage';
import DepartmentDetailPage from './pages/institute/DepartmentDetailPage';
import InstituteResearchPage from './pages/institute/InstituteResearchPage';
import CentersPage from './pages/institute/CentersPage';
import StudentLifePage from './pages/institute/StudentLifePage';
import CampusPage from './pages/institute/CampusPage';
import AlumniRelationsPage from './pages/institute/AlumniRelationsPage';

import { ProtectedRoute, VerificationRequiredPage } from './components/auth/guards';

const GuestRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/feed" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* ── Auth Routes ───────────────────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path="/login"                  element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register"               element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password"        element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password/:token"  element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/verify-email/:token"    element={<VerifyEmailPage />} />
        <Route path="/auth/callback"          element={<AuthCallbackPage />} />
      </Route>

      {/* ── Standalone / no-layout routes ─────────────────────────────────── */}
      <Route path="/verification-required" element={<VerificationRequiredPage />} />
      <Route path="/onboarding"            element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

      {/* ── Main App (with Layout) ────────────────────────────────────────── */}
      <Route element={<Layout />}>
        <Route path="/"      element={<HomePage />} />

        {/* ── IITRAM Institutional Information ─────────────────────────── */}
        <Route path="/institute" element={<InstituteLayout />}>
          <Route index                        element={<InstituteIndexPage />} />
          <Route path="about"                 element={<AboutPage />} />
          <Route path="academics"             element={<AcademicsPage />} />
          <Route path="departments"           element={<DepartmentsPage />} />
          <Route path="departments/:departmentId" element={<DepartmentDetailPage />} />
          <Route path="research"              element={<InstituteResearchPage />} />
          <Route path="centers"               element={<CentersPage />} />
          <Route path="student-life"          element={<StudentLifePage />} />
          <Route path="campus"                element={<CampusPage />} />
          <Route path="alumni-relations"      element={<AlumniRelationsPage />} />
        </Route>

        {/* ── People / Directory (merged alumni + students) ─────────────── */}
        <Route path="/directory"           element={<DirectoryPage />} />
        {/* Legacy redirects — keep old URLs working */}
        <Route path="/alumni"              element={<Navigate to="/directory" replace />} />
        <Route path="/students"            element={<Navigate to="/directory?tab=students" replace />} />

        {/* ── Profiles ──────────────────────────────────────────────────── */}
        <Route path="/alumni/:userId"      element={<AlumniProfilePage />} />
        <Route path="/students/:userId"    element={<ProfilePage />} />
        <Route path="/profile"             element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit"        element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:userId"     element={<ProfilePage />} />

        {/* ── Community Feed ────────────────────────────────────────────── */}
        <Route path="/feed"                element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />

        {/* ── Jobs ──────────────────────────────────────────────────────── */}
        <Route path="/jobs"                element={<JobsPage />} />
        <Route path="/jobs/post"           element={<ProtectedRoute permission="job:create" requireVerifiedAccount><PostJobPage /></ProtectedRoute>} />
        <Route path="/jobs/:jobId"         element={<JobDetailPage />} />

        {/* ── Events ────────────────────────────────────────────────────── */}
        <Route path="/events"              element={<EventsPage />} />
        <Route path="/events/create"       element={<ProtectedRoute permission="event:create" requireVerifiedAccount><CreateEventPage /></ProtectedRoute>} />
        <Route path="/events/:eventId"     element={<EventDetailPage />} />

        {/* ── Mentorship ────────────────────────────────────────────────── */}
        <Route path="/mentorship"             element={<ProtectedRoute><MentorshipPage /></ProtectedRoute>} />
        <Route path="/mentorship/:mentorshipId" element={<ProtectedRoute><MentorshipDetailPage /></ProtectedRoute>} />

        {/* ── Stories + Legacy (merged) ─────────────────────────────────── */}
        <Route path="/stories"             element={<StoriesPage />} />
        <Route path="/stories/create"      element={<ProtectedRoute permission="story:create" requireVerifiedAccount><CreateStoryPage /></ProtectedRoute>} />
        <Route path="/stories/:storyId"    element={<StoryDetailPage />} />
        {/* Legacy redirects */}
        <Route path="/legacy"              element={<Navigate to="/stories?tab=legacy" replace />} />
        <Route path="/success-stories"     element={<Navigate to="/stories" replace />} />

        {/* ── Research ──────────────────────────────────────────────────── */}
        <Route path="/research"            element={<ResearchPage />} />

        {/* ── Startups ──────────────────────────────────────────────────── */}
        <Route path="/startups"            element={<ProtectedRoute><StartupEcosystemPage /></ProtectedRoute>} />

        {/* ── Analytics (admin-gated; non-admins see locked message) ──────── */}
        <Route path="/analytics"           element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

        {/* ── Messages & Notifications ──────────────────────────────────── */}
        <Route path="/messages"            element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/notifications"       element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        {/* ── Admin ─────────────────────────────────────────────────────── */}
        <Route path="/admin"               element={<ProtectedRoute permission="admin:panel_access"><AdminPage /></ProtectedRoute>} />

        <Route path="*"                    element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
