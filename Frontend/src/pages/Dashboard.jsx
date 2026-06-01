import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompetitors } from '../hooks/useCompetitors';
import { useAlerts } from '../hooks/useAlerts';
import StatCard from '../components/StatCard';
import CompetitorCard from '../components/CompetitorCard';
import RecentAlerts from '../components/RecentAlerts';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { stats as mockStats, competitors as mockCompetitors, recentAlerts as mockAlerts } from '../utils/mockData';

const DEMO_EMAIL = 'test@gmail.com';

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

function withinDays(dateStr, days) {
  return Date.now() - new Date(dateStr).getTime() < days * 86400000;
}

// Map backend severity string to lowercase key used by RecentAlerts
function normaliseSeverity(s = '') {
  const v = s.toLowerCase();
  if (v === 'high')   return 'high';
  if (v === 'medium') return 'medium';
  return 'low';
}

// Shape a backend alert into what RecentAlerts expects
function shapeAlert(a) {
  return {
    id:         a.id,
    competitor: a.competitorName ?? 'Unknown',
    type:       a.message ?? a.alertType ?? '',
    timeAgo:    timeAgo(a.createdAt),
    severity:   normaliseSeverity(a.severity),
  };
}

// Shape a backend competitor into what CompetitorCard expects
function shapeCompetitor(c) {
  return {
    id:             c.id,
    name:           c.name,
    url:            c.websiteUrl?.replace(/^https?:\/\//, '') ?? '',
    lastMonitored:  c.lastMonitoredAt ? timeAgo(c.lastMonitoredAt) : 'Never',
    alertCount:     0,
    sentiment:      'neutral',
    sentimentScore: 50,
    sentimentWidth: 'w-[50%]',
    isActive:       c.isActive,
  };
}

// ── Real dashboard ────────────────────────────────────────────────────────────

function RealDashboard() {
  const { competitors, isLoading: loadingC } = useCompetitors();
  const { alerts,      isLoading: loadingA } = useAlerts(false);

  const weekAlerts   = alerts.filter((a) => withinDays(a.createdAt, 7));
  const weekChanges  = weekAlerts.filter((a) =>
    ['PageChange', 'PricingChange'].includes(a.alertType)
  );

  const stats = [
    { id: 1, label: 'Total Competitors', value: loadingC ? '…' : competitors.length, color: 'blue',   icon: 'users'       },
    { id: 2, label: 'Alerts This Week',  value: loadingA ? '…' : weekAlerts.length,  color: 'red',    icon: 'bell'        },
    { id: 3, label: 'Changes Detected',  value: loadingA ? '…' : weekChanges.length, color: 'orange', icon: 'zap'         },
    { id: 4, label: 'Reports Generated', value: 0,                                   color: 'green',  icon: 'file-chart'  },
  ];

  const shapedCompetitors = competitors.map(shapeCompetitor);
  const recentAlerts      = alerts.slice(0, 5).map(shapeAlert);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => <StatCard key={s.id} {...s} />)}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Competitor cards */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Competitors</h2>
            <span className="text-xs text-slate-400">{loadingC ? '…' : competitors.length} tracked</span>
          </div>

          {loadingC ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
            </div>
          ) : shapedCompetitors.length === 0 ? (
            <EmptyState
              title="No competitors yet"
              message="Start tracking your first competitor to see data here."
            >
              <Link
                to="/competitors/add"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
              >
                Add Competitor
              </Link>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shapedCompetitors.map((c) => <CompetitorCard key={c.id} competitor={c} />)}
            </div>
          )}
        </div>

        {/* Recent alerts */}
        <div className="xl:col-span-1">
          {loadingA ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse h-16 rounded-xl bg-slate-800 border border-slate-700" />
              ))}
            </div>
          ) : (
            <RecentAlerts alerts={recentAlerts} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mock dashboard (demo / test account) ─────────────────────────────────────

function MockDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {mockStats.map((s) => <StatCard key={s.id} {...s} />)}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Competitors</h2>
            <span className="text-xs text-slate-400">{mockCompetitors.length} tracked</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mockCompetitors.map((c) => <CompetitorCard key={c.id} competitor={c} />)}
          </div>
        </div>
        <div className="xl:col-span-1">
          <RecentAlerts alerts={mockAlerts} />
        </div>
      </div>
    </div>
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const isDemo   = user?.email?.toLowerCase() === DEMO_EMAIL;
  return isDemo ? <MockDashboard /> : <RealDashboard />;
}
