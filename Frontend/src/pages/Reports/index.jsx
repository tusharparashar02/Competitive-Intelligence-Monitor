import { useNavigate } from 'react-router-dom';
import { FileBarChart2, CalendarDays, Users, ArrowRight } from 'lucide-react';
import { useReports } from '../../hooks/useReports';
import EmptyState from '../../components/EmptyState';

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkeletonReportCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-700 bg-slate-800 p-5 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-slate-700" />
          <div className="h-3 w-28 rounded bg-slate-700/60" />
        </div>
        <div className="h-5 w-16 rounded-full bg-slate-700/60" />
      </div>
      <div className="h-3 w-full rounded bg-slate-700/60" />
      <div className="h-3 w-3/4 rounded bg-slate-700/60" />
      <div className="flex justify-between pt-2 border-t border-slate-700">
        <div className="h-3 w-24 rounded bg-slate-700/60" />
        <div className="h-6 w-24 rounded-lg bg-slate-700" />
      </div>
    </div>
  );
}

function ReportCard({ report }) {
  const navigate = useNavigate();
  const weekRange = `${fmt(report.weekStart)} – ${fmt(report.weekEnd)}`;
  const preview   = report.content
    ? report.content.slice(0, 120).trimEnd() + '…'
    : 'Weekly intelligence briefing covering all monitored competitors.';

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 flex flex-col gap-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white leading-snug">Weekly Intelligence Briefing</h3>
          <p className="mt-0.5 text-xs font-medium text-indigo-400">{weekRange}</p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
          {fmt(report.generatedAt)}
        </span>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">{preview}</p>

      <div className="flex items-center justify-between pt-1 border-t border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={12} />
            <span>{report.competitorsCovered ?? 0} competitors</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays size={12} />
            <span>{fmt(report.generatedAt)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/reports/${report.id}`)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          View Report <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

export default function Reports() {
  const { reports, isLoading } = useReports();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileBarChart2 size={18} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Intelligence Reports</h2>
        </div>
        {!isLoading && (
          <span className="text-xs text-slate-500">{reports.length} reports generated</span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2, 3].map((n) => <SkeletonReportCard key={n} />)}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports generated yet"
          message="Reports are generated every Monday automatically once competitors are being monitored."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reports.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  );
}
