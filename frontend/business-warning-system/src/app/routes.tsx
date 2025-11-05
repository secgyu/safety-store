import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ActionPlanPage from '@/pages/action-plan'
import CalculatorsPage from '@/pages/calculators'
import ComparePage from '@/pages/compare'
import ConsultationPage from '@/pages/consultation'
import DashboardPage from '@/pages/dashboard'
import DiagnosePage from '@/pages/diagnose'
import FaqPage from '@/pages/faq'
import GuidePage from '@/pages/guide'
import HomePage from '@/pages/index'
import InsightsPage from '@/pages/insights'
import LoginPage from '@/pages/login'
import NotificationsPage from '@/pages/notifications'
import PrivacyPage from '@/pages/privacy'
import ResultsPage from '@/pages/results'
import SettingsPage from '@/pages/settings'
import SignupPage from '@/pages/signup'
import StatisticsPage from '@/pages/statistics'
import SuccessStoriesPage from '@/pages/success-stories'
import SupportPage from '@/pages/support'
import TermsPage from '@/pages/terms'
import { ScrollToTop } from '@/shared/components/common/ScrollToTop'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/diagnose" element={<DiagnosePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/action-plan" element={<ActionPlanPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

