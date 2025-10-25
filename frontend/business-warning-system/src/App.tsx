import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";

// Pages
import HomePage from "./pages/page";
import LoginPage from "./pages/login/page";
import SignupPage from "./pages/signup/page";
import DashboardPage from "./pages/dashboard/page";
import DiagnosePage from "./pages/diagnose/page";
import ResultsPage from "./pages/results/page";
import ActionPlanPage from "./pages/action-plan/page";
import ComparePage from "./pages/compare/page";
import CalculatorsPage from "./pages/calculators/page";
import ConsultationPage from "./pages/consultation/page";
import NotificationsPage from "./pages/notifications/page";
import SettingsPage from "./pages/settings/page";
import SupportPage from "./pages/support/page";
import FaqPage from "./pages/faq/page";
import GuidePage from "./pages/guide/page";
import BlogPage from "./pages/blog/page";
import StatisticsPage from "./pages/statistics/page";
import InsightsPage from "./pages/insights/page";
import SuccessStoriesPage from "./pages/success-stories/page";
import TermsPage from "./pages/terms/page";
import PrivacyPage from "./pages/privacy/page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000, // 1분
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
