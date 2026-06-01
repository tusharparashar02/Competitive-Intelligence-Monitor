import { User, Mail, Clock, Calendar, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-700 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700">
        <Icon size={14} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-white truncate">{value}</p>
      </div>
    </div>
  );
}

const MONITORING_SCHEDULE = [
  { icon: Clock,    label: 'Daily Monitoring',  value: 'Runs every day at 3:00 AM UTC — scrapes jobs, changelogs, Reddit, and page snapshots for all active competitors.' },
  { icon: Calendar, label: 'Weekly Reports',    value: 'Generated every Monday at 8:00 AM UTC — summarises the past week\'s intelligence across all competitors.' },
  { icon: Shield,   label: 'Alert Delivery',    value: 'Alerts are pushed in real-time via WebSocket when significant changes are detected during monitoring runs.' },
];

export default function Settings() {
  const { user, logout } = useAuth();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Account section */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">Account</h2>
          <p className="text-xs text-slate-500 mt-0.5">Your profile information</p>
        </div>
        <div className="px-6 py-2">
          <InfoRow icon={User}     label="Full Name"   value={user?.name  ?? '—'} />
          <InfoRow icon={Mail}     label="Email"       value={user?.email ?? '—'} />
          <InfoRow icon={Calendar} label="Member Since" value={joinedDate}         />
        </div>
      </div>

      {/* Monitoring status section */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">Monitoring Status</h2>
          <p className="text-xs text-slate-500 mt-0.5">Background job schedule</p>
        </div>
        <div className="px-6 py-2">
          {MONITORING_SCHEDULE.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 py-3 border-b border-slate-700 last:border-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 mt-0.5">
                <Icon size={14} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-500/20 bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/20">
          <h2 className="text-sm font-semibold text-white">Session</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sign out of your account</p>
        </div>
        <div className="px-6 py-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5
              text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
}
