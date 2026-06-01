import { AlertTriangle, Info, Zap } from 'lucide-react';

const severityConfig = {
  high:   { icon: Zap,           text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    label: 'High'   },
  medium: { icon: AlertTriangle, text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Medium' },
  low:    { icon: Info,          text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   label: 'Low'    },
};

export default function RecentAlerts({ alerts }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-white">Recent Alerts</h2>
        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
          {alerts.length} new
        </span>
      </div>

      <ul className="divide-y divide-slate-700/60">
        {alerts.map((alert) => {
          const s = severityConfig[alert.severity];
          const Icon = s.icon;
          return (
            <li key={alert.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-700/30 transition-colors">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${s.bg} border ${s.border}`}>
                <Icon size={13} className={s.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{alert.competitor}</p>
                <p className="text-xs text-slate-400 truncate">{alert.type}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-[10px] font-semibold ${s.text}`}>{s.label}</span>
                <span className="text-[10px] text-slate-500">{alert.timeAgo}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-3 border-t border-slate-700">
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          View all alerts →
        </button>
      </div>
    </div>
  );
}
