import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

// Core Pages
import { HomePage } from './pages/HomePage';
import { AssessmentPage } from './pages/AssessmentPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { DashboardPage } from './pages/DashboardPage';
import { CareersPage } from './pages/CareersPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { ComparePage } from './pages/ComparePage';
import { BudgetPage } from './pages/BudgetPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ReviewsDemoPage } from './pages/ReviewsDemoPage';
import { NavigationPage } from './pages/NavigationPage';

// Auth & Student Profile Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfileSetupPage } from './pages/profile/ProfileSetupPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { PublicProfilePage } from './pages/profile/PublicProfilePage';

// Community & Video Sharing Pages
import { CommunityPage } from './pages/community/CommunityPage';
import { VideoUploadPage } from './pages/community/VideoUploadPage';
import { StoryDetailPage } from './pages/community/StoryDetailPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Landing & Guided Flow */}
          <Route index element={<HomePage />} />
          <Route path="assessment" element={<AssessmentPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />

          {/* Student Auth & Profiles */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="profile/setup" element={<ProfileSetupPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:username" element={<PublicProfilePage />} />

          {/* Student Community & Video Sharing */}
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/upload" element={<VideoUploadPage />} />
          <Route path="community/story/:storyId" element={<StoryDetailPage />} />

          {/* Core Guidance Tools */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/:careerId" element={<CareerDetailPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="skill-gap" element={<SkillGapPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="resources" element={<ResourcesPage />} />

          {/* Preserved Simulated Demos & GPS Navigation */}
          <Route path="reviews" element={<ReviewsDemoPage />} />
          <Route path="projects" element={<Navigate to="/community" replace />} />
          <Route path="navigation" element={<NavigationPage />} />
          <Route path="colleges" element={<NavigationPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
