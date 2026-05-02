import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";

// Public layout & pages
import PublicLayout from "@/layouts/PublicLayout";
import LandingPage from "@/pages/public/LandingPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import PricingPage from "@/pages/public/PricingPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import TermsPage from "@/pages/public/TermsPage";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import AuthCallback from "@/pages/auth/AuthCallback";

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

      {/* Auth routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/auth/callback" component={AuthCallback} />

      {/* Dashboard routes */}
      <Route path="/dashboard">
        <DashboardLayout><DashboardHome /></DashboardLayout>
      </Route>
      <Route path="/dashboard/analyzer">
        <DashboardLayout><AnalyzerPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/ai-studio">
        <DashboardLayout><AiStudioPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/scheduler">
        <DashboardLayout><SchedulerPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/analytics">
        <DashboardLayout><AnalyticsPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/keywords">
        <DashboardLayout><KeywordsPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/hashtags">
        <DashboardLayout><HashtagsPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/competitors">
        <DashboardLayout><CompetitorsPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/profile-audit">
        <DashboardLayout><ProfileAuditPage /></DashboardLayout>
      </Route>
      <Route path="/dashboard/settings">
        <DashboardLayout><SettingsPage /></DashboardLayout>
      </Route>

      {/* Admin routes */}
      <Route path="/admin">
        <AdminLayout><AdminOverviewPage /></AdminLayout>
      </Route>
      <Route path="/admin/users">
        <AdminLayout><AdminUsersPage /></AdminLayout>
      </Route>
      <Route path="/admin/api-health">
        <AdminLayout><AdminApiHealthPage /></AdminLayout>
      </Route>
      <Route path="/admin/flags">
        <AdminLayout><AdminFlagsPage /></AdminLayout>
      </Route>
      <Route path="/admin/seo-config">
        <AdminLayout><AdminSeoConfigPage /></AdminLayout>
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
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
      <Toaster />
    </WouterRouter>
  );
}

export default App;
