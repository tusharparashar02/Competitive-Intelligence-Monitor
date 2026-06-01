import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

/*
 * ── API TEST CHECKLIST ────────────────────────────────────────────────────────
 * Test each endpoint manually in Swagger at http://localhost:5011/swagger
 *
 * AUTH (no token needed)
 *   POST /api/auth/register        { name, email, password }  → 200 AuthResponse
 *   POST /api/auth/login           { email, password }        → 200 AuthResponse { token, user }
 *   GET  /api/auth/me              Bearer token               → 200 UserResponse
 *
 * COMPETITORS (Bearer token required for all)
 *   GET    /api/competitors                    → 200 ApiResponse<CompetitorResponse[]>
 *   POST   /api/competitors                    → 200 ApiResponse<CompetitorResponse>
 *   GET    /api/competitors/{id}               → 200 | 404
 *   PUT    /api/competitors/{id}               → 200 | 404
 *   DELETE /api/competitors/{id}               → 200 | 404
 *
 * INTELLIGENCE (Bearer token required)
 *   GET /api/competitors/{id}/jobs             → 200 ApiResponse<PaginatedResponse<JobPostingResponse>>
 *   GET /api/competitors/{id}/changes          → 200 ApiResponse<PaginatedResponse<PageChangeResponse>>
 *   GET /api/competitors/{id}/reviews          → 200 ApiResponse<PaginatedResponse<RedditMentionResponse>>
 *   GET /api/competitors/{id}/reviews/sentiment?lastDays=30  → 200 ApiResponse<double>
 *   GET /api/competitors/{id}/changelog        → 200 ApiResponse<PaginatedResponse<ChangelogEntryResponse>>
 *
 * REPORTS
 *   GET /api/reports               → 200 ApiResponse<WeeklyReportResponse[]>
 *   GET /api/reports/{id}          → 200 | 404
 *
 * ALERTS
 *   GET /api/alerts?unreadOnly=false           → 200 ApiResponse<AlertResponse[]>
 *   GET /api/alerts/unread-count               → 200 ApiResponse<int>
 *   PUT /api/alerts/{id}/read                  → 200 | 404
 *   PUT /api/alerts/read-all                   → 200
 *
 * HEALTH (no token)
 *   GET /health                    → 200 { message: "API is running", utc: "..." }
 *
 * SIGNALR
 *   WS  /hubs/notifications        → connect with ?access_token=<jwt>
 *       Client event: "ReceiveAlert" → AlertResponse
 * ─────────────────────────────────────────────────────────────────────────────
 */
import ProtectedRoute from './components/ProtectedRoute';
import PageWrapper from './components/PageWrapper';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobPostings from './pages/JobPostings';
import PricingChanges from './pages/PricingChanges';
import Changelogs from './pages/Changelogs';
import ReviewSentiment from './pages/ReviewSentiment';
import AddCompetitor from './pages/AddCompetitor';
import CompetitorDetail from './pages/CompetitorDetail/index';
import Competitors from './pages/Competitors';
import Reports from './pages/Reports/index';
import ReportDetail from './pages/Reports/ReportDetail';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

function Placeholder({ title }) {
  return <div className="text-slate-500 text-sm">{title} — coming soon</div>;
}

function AppRoute({ children }) {
  return (
    <ProtectedRoute>
      <PageWrapper>{children}</PageWrapper>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected app routes */}
        <Route path="/dashboard"       element={<AppRoute><Dashboard /></AppRoute>} />
        <Route path="/competitors/add" element={<AppRoute><AddCompetitor /></AppRoute>} />
        <Route path="/competitors/:id" element={<AppRoute><CompetitorDetail /></AppRoute>} />
        <Route path="/competitors"     element={<AppRoute><Competitors /></AppRoute>} />
        <Route path="/reports"         element={<AppRoute><Reports /></AppRoute>} />
        <Route path="/reports/:id"      element={<AppRoute><ReportDetail /></AppRoute>} />
        <Route path="/job-postings"    element={<AppRoute><JobPostings /></AppRoute>} />
        <Route path="/pricing"         element={<AppRoute><PricingChanges /></AppRoute>} />
        <Route path="/changelogs"      element={<AppRoute><Changelogs /></AppRoute>} />
        <Route path="/reviews"         element={<AppRoute><ReviewSentiment /></AppRoute>} />
        <Route path="/alerts"          element={<AppRoute><Alerts /></AppRoute>} />
        <Route path="/settings"        element={<AppRoute><Settings /></AppRoute>} />
      </Routes>
    </>
  );
}
