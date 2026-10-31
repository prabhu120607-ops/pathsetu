import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { AssessmentPage } from './pages/AssessmentPage';
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="assessment" element={<AssessmentPage />} />
          <Route path="profile" element={<Navigate to="/assessment" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/:careerId" element={<CareerDetailPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="skill-gap" element={<SkillGapPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="reviews" element={<ReviewsDemoPage />} />
          <Route path="projects" element={<Navigate to="/reviews" replace />} />
          <Route path="navigation" element={<NavigationPage />} />
          <Route path="colleges" element={<NavigationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
