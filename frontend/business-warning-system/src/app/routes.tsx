import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ActionPlanPage from '@/pages/action-plan/page'
import CalculatorsPage from '@/pages/calculators/page'
import ComparePage from '@/pages/compare/page'
import ConsultationPage from '@/pages/consultation/page'
import DashboardPage from '@/pages/dashboard/page'
import DiagnosePage from '@/pages/diagnose/page'
import FaqPage from '@/pages/faq/page'
import GuidePage from '@/pages/guide/page'
import InsightsPage from '@/pages/insights/page'
import LoginPage from '@/pages/login/page'
import NotificationsPage from '@/pages/notifications/page'
import HomePage from '@/pages/page'
import PrivacyPage from '@/pages/privacy/page'
import ResultsPage from '@/pages/results/page'
import SettingsPage from '@/pages/settings/page'
import SignupPage from '@/pages/signup/page'
import StatisticsPage from '@/pages/statistics/page'
import SuccessStoriesPage from '@/pages/success-stories/page'
import SupportPage from '@/pages/support/page'
import TermsPage from '@/pages/terms/page'

export function AppRoutes() {
  return (
    <BrowserRouter>
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

