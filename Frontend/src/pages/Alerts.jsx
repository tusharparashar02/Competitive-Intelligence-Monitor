import { useState } from 'react';
import { Bell, CheckCheck, Check } from 'lucide-react';
import { useAlerts, useMarkAsRead, useMarkAllAsRead } from '../hooks/useAlerts';
import EmptyState from '../components/EmptyState';

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

const SEVERITY_STYLE = {
  High:   'bg-red-500/10 border-red-500/20 text-red-400',
  Medium: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  Low:    'bg-slate-700 border-slate-600 text-slate-400',
};

const ALERT_TYPE_STYLE = {
  NewJobPostings: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  PricingChange:  'bg-purple-500/10 border-purple-500/20 text-purple-400',
  SentimentShift: 'bg-red-500/10 border-red-500/20 text-red-400',
  NewChangelog:   'bg-green-500/10 border-green-500/20 text-green-400',
  PageChange:     'bg-orange-500/10 border-orange-500/20 text-orange-400',
};

const ALERT_TYPE_LABEL = {
  NewJobPostings: 'New Jobs',
  PricingChange:  'Pricing',
  SentimentShift: 'Sentiment',
  NewChangelog:   'Changelog',
  PageChange:     'Page Change',
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonAlert() {
  return (
    <div className="animate-pulse flex items-start gap-4 rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="h-8 w-8 rounded-lg bg-slate-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-20 rounded-full bg-slate-700" />
          <div className="h-4 w-16 rounded-full bg-slate-700/60" />
        </div>
        <div className="h-3 w-3/4 rounded bg-slate-700/60" />
        <div className="h-3 w-1/3 rounded bg-slate-700/60" />
      </div>
    </div>
  );
}

// ── Alert row ─────────────────────────────────────────────────────────────────

function AlertRow({ alert, onMarkRead, isMarking }) {
  const severityClass  = SEVERITY_STYLE[alert.severity]   ?? SEVERITY_STYLE.Low;
  const typeClass      = ALERT_TYPE_STYLE[alert.alertType] ?? 'bg-slate-700 border-slate-600 text-slate-400';
  const typeLabel      = ALERT_TYPE_LABEL[alert.alertType] ?? alert.alertType;

  return (
    <div className={`flex items-start gap-4 rounded-xl border p-4 transition-colors
      ${alert.isRead
        ? 'border-slate-700 bg-slate-800'
        : 'border-indigo-500/20 bg-indigo-500/5'
      }`}
    >
      {/* Unread dot */}
      <div className="mt-1 shrink-0">
        {!alert.isRead && (
          <span className="block h-2 w-2 rounded-full bg-indigo-400" />
        )}
        {alert.isRead && (
          <span className="block h-2 w-2 rounded-full bg-slate-700" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-white">{alert.competitorName ?? 'Unknown'}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeClass}`}>
            {typeLabel}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${severityClass}`}>
            {alert.severity}
          </span>
        </div>
        {alert.message && (
          <p className="text-sm text-slate-300 leading-snug">{alert.message}</p>
        )}
        <p className="text-xs text-slate-500">{timeAgo(alert.createdAt)}</p>
      </div>

      {/* Mark as read */}
      {!alert.isRead && (
        <button
          onClick={() => onMarkRead(alert.id)}
          disabled={isMarking}
          className="shrink-0 flex items-center gap-1 rounded-lg border border-slate-600 px-2.5 py-1.5 text-xs text-slate-400
            hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
          title="Mark as read"
        >
          <Check size={12} /> Read
        </button>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Alerts() {
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { alerts, isLoading }          = useAlerts(unreadOnly);
  const { markAsRead, isMarking }      = useMarkAsRead();
  const { markAllAsRead, isMarkingAll } = useMarkAllAsRead();

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Alerts</h2>
          {!isLoading && (
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
              {alerts.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
            <button
              onClick={() => setUnreadOnly(false)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors
                ${!unreadOnly ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setUnreadOnly(true)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors
                ${unreadOnly ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium
                text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <CheckCheck size={13} />
              {isMarkingAll ? 'Marking…' : 'Mark All Read'}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => <SkeletonAlert key={n} />)}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          title={unreadOnly ? 'No unread alerts' : 'No alerts yet'}
          message={unreadOnly
            ? 'All caught up! Switch to "All Alerts" to see your history.'
            : 'Alerts will appear here when monitoring detects changes for your competitors.'
          }
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onMarkRead={markAsRead}
              isMarking={isMarking}
            />
          ))}
        </div>
      )}
    </div>
  );
}
