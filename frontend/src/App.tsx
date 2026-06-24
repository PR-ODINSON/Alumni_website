import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import VerifyEmailPage from './pages/auth/VerifyEmail';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import AuthCallbackPage from './pages/auth/AuthCallback';

import AlumniDirectoryPage from './pages/alumni/AlumniDirectory';
import AlumniProfilePage from './pages/alumni/AlumniProfile';
import StudentDirectoryPage from './pages/students/StudentDirectory';

import FeedPage from './pages/community/Feed';
import JobsPage from './pages/jobs/Jobs';
import JobDetailPage from './pages/jobs/JobDetail';
import EventsPage from './pages/events/Events';
import EventDetailPage from './pages/events/EventDetail';
import MentorshipPage from './pages/mentorship/Mentorship';
import SuccessStoriesPage from './pages/stories/SuccessStories';
import StoryDetailPage from './pages/stories/StoryDetail';
import AnalyticsPage from './pages/analytics/Analytics';
import AdminPage from './pages/admin/Admin';
import MessagesPage from './pages/messages/Messages';
import ProfilePage from './pages/profile/Profile';
import EditProfilePage from './pages/profile/EditProfile';
import NotificationsPage from './pages/notifications/Notifications';
import ResearchPage from './pages/research/Research';
import LegacyArchivePage from './pages/legacy/LegacyArchive';
import StartupEcosystemPage from './pages/startups/StartupEcosystem';
import OnboardingPage from './pages/onboarding/Onboarding';
import NotFoundPage from './pages/NotFound';

const ProtectedRoute = ({ children, roles }: { children: React.ReactElement; roles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/feed" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Route>

      {/* Onboarding (outside main layout) */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

      {/* Main App Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/alumni" element={<AlumniDirectoryPage />} />
        <Route path="/alumni/:userId" element={<AlumniProfilePage />} />
        <Route path="/students" element={<StudentDirectoryPage />} />
        <Route path="/students/:userId" element={<ProfilePage />} />
        <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/mentorship" element={<ProtectedRoute><MentorshipPage /></ProtectedRoute>} />
        <Route path="/stories" element={<SuccessStoriesPage />} />
        <Route path="/stories/:storyId" element={<StoryDetailPage />} />
        <Route path="/success-stories" element={<Navigate to="/stories" replace />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/legacy" element={<LegacyArchivePage />} />
        <Route path="/startups" element={<StartupEcosystemPage />} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
