import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";
import { AuthProvider, ProtectedRoute } from "@/lib/AuthContext";

// Public layout & pages
import PublicLayout from "@/layouts/PublicLayout";
import LandingPage from "@/pages/public/LandingPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import PricingPage from "@/pages/public/PricingPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import TermsPage from "@/pages/public/TermsPage";
import AboutPage from "@/pages/public/AboutPage";
import ContactPage from "@/pages/public/ContactPage";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";

// Dashboard layout & pages
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import AnalyzerPage from "@/pages/dashboard/AnalyzerPage";
import AiStudioPage from "@/pages/dashboard/AiStudioPage";
import SchedulerPage from "@/pages/dashboard/SchedulerPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import KeywordsPage from "@/pages/dashboard/KeywordsPage";
import HashtagsPage from "@/pages/dashboard/HashtagsPage";
import CompetitorsPage from "@/pages/dashboard/CompetitorsPage";
import ProfileAuditPage from "@/pages/dashboard/ProfileAuditPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";

// Admin layout & pages
import AdminLayout from "@/layouts/AdminLayout";
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminApiHealthPage from "@/pages/admin/AdminApiHealthPage";
import AdminFlagsPage from "@/pages/admin/AdminFlagsPage";
import AdminSeoConfigPage from "@/pages/admin/AdminSeoConfigPage";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        <PublicLayout><LandingPage /></PublicLayout>
      </Route>
      <Route path="/features">
        <PublicLayout><FeaturesPage /></PublicLayout>
      </Route>
      <Route path="/pricing">
        <PublicLayout><PricingPage /></PublicLayout>
      </Route>
      <Route path="/privacy">
        <PublicLayout><PrivacyPage /></PublicLayout>
      </Route>
      <Route path="/terms">
        <PublicLayout><TermsPage /></PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout><AboutPage /></PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout><ContactPage /></PublicLayout>
      </Route>

      {/* Auth routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/verify-email" component={EmailVerificationPage} />

      {/* Dashboard routes — all protected */}
      <Route path="/dashboard">
        <ProtectedRoute><DashboardLayout><DashboardHome /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/analyzer">
        <ProtectedRoute><DashboardLayout><AnalyzerPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/ai-studio">
        <ProtectedRoute><DashboardLayout><AiStudioPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/scheduler">
        <ProtectedRoute><DashboardLayout><SchedulerPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/analytics">
        <ProtectedRoute><DashboardLayout><AnalyticsPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/keywords">
        <ProtectedRoute><DashboardLayout><KeywordsPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/hashtags">
        <ProtectedRoute><DashboardLayout><HashtagsPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/competitors">
        <ProtectedRoute><DashboardLayout><CompetitorsPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/profile-audit">
        <ProtectedRoute><DashboardLayout><ProfileAuditPage /></DashboardLayout></ProtectedRoute>
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>
      </Route>

      {/* Admin routes — protected */}
      <Route path="/admin">
        <ProtectedRoute><AdminLayout><AdminOverviewPage /></AdminLayout></ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute><AdminLayout><AdminUsersPage /></AdminLayout></ProtectedRoute>
      </Route>
      <Route path="/admin/api-health">
        <ProtectedRoute><AdminLayout><AdminApiHealthPage /></AdminLayout></ProtectedRoute>
      </Route>
      <Route path="/admin/flags">
        <ProtectedRoute><AdminLayout><AdminFlagsPage /></AdminLayout></ProtectedRoute>
      </Route>
      <Route path="/admin/seo-config">
        <ProtectedRoute><AdminLayout><AdminSeoConfigPage /></AdminLayout></ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route>
        <div className="flex items-center justify-center min-h-screen flex-col gap-4">
          <div className="text-6xl font-black">404</div>
          <div className="text-lg font-bold">Page not found</div>
          <a href="/" className="btn btn-red">Go Home</a>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  const base = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
  return (
    <AuthProvider>
      <WouterRouter base={base || undefined}>
        <Router />
        <Toaster />
      </WouterRouter>
    </AuthProvider>
  );
}

export default App;
