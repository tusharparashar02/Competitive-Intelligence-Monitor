import { CalendarDays, Users, ArrowRight } from 'lucide-react';

export default function ReportCard({ report, onView }) {
  const preview = report.summary.length > 100
    ? report.summary.slice(0, 100).trimEnd() + '…'
    : report.summary;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 flex flex-col gap-4 hover:border-slate-600 transition-colors">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white leading-snug">
            Weekly Intelligence Briefing
          </h3>
          <p className="mt-0.5 text-xs font-medium text-indigo-400">{report.weekRange}</p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
          Week #{report.id}
        </span>
      </div>

      {/* Insight preview */}
      <p className="text-sm text-slate-400 leading-relaxed">{preview}</p>

      {/* Meta + action */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={12} />
            <span>{report.competitorCount} competitors</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays size={12} />
            <span>{report.generatedDate}</span>
          </div>
        </div>
        <button
          onClick={() => onView(report.id)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          View Report
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
