import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CalendarDays, Users } from 'lucide-react';
import { useReport } from '../../hooks/useReports';

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkeletonDetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-slate-700" />
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 space-y-4">
        <div className="h-3 w-32 rounded bg-slate-700/60" />
        <div className="h-7 w-64 rounded bg-slate-700" />
        <div className="h-3 w-full rounded bg-slate-700/60" />
        <div className="h-3 w-5/6 rounded bg-slate-700/60" />
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 space-y-3">
        {[1, 2, 3].map((n) => <div key={n} className="h-4 w-full rounded bg-slate-700/60" />)}
      </div>
    </div>
  );
}

export default function ReportDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { report, isLoading } = useReport(id);

  if (isLoading) return <SkeletonDetail />;

  if (!report) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} /> Back to Reports
        </button>
        <div className="text-center py-16 text-slate-400 text-sm">Report not found.</div>
      </div>
    );
  }

  const weekRange = `${fmt(report.weekStart)} – ${fmt(report.weekEnd)}`;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} /> Back to Reports
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Printer size={13} /> Print / Export
        </button>
      </div>

      {/* Header card */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
          Weekly Intelligence Briefing
        </p>
        <h2 className="text-2xl font-bold text-white mb-3">{weekRange}</h2>
        {report.title && (
          <p className="text-sm text-slate-300 leading-relaxed mb-4">{report.title}</p>
        )}
        <div className="flex flex-wrap gap-5 border-t border-slate-700 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users size={13} className="text-slate-500" />
            <span>{report.competitorsCovered ?? 0} competitors covered</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays size={13} className="text-slate-500" />
            <span>Generated {fmt(report.generatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {report.content ? (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Report Content</h3>
          <div className="prose prose-invert prose-sm max-w-none">
            {report.content.split('\n').filter(Boolean).map((line, i) => (
              <p key={i} className="text-sm text-slate-300 leading-relaxed mb-2">{line}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-center text-sm text-slate-500">
          Report content is being generated…
        </div>
      )}
    </div>
  );
}
