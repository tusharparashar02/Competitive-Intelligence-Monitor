import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { usePageChanges } from '../../../hooks/useIntelligence';
import Pagination from '../../../components/Pagination';
import EmptyState from '../../../components/EmptyState';

const SEVERITY = {
  High:   'bg-red-500/10 border-red-500/20 text-red-400',
  Medium: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  Low:    'bg-slate-700 border-slate-600 text-slate-400',
};

const CHANGE_TYPE = {
  PricingChange:  'bg-purple-500/10 border-purple-500/20 text-purple-400',
  NewFeature:     'bg-green-500/10 border-green-500/20 text-green-400',
  ContentUpdate:  'bg-blue-500/10 border-blue-500/20 text-blue-400',
  Other:          'bg-slate-700 border-slate-600 text-slate-400',
};

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkeletonChange() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-700 bg-slate-800 p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-3 w-48 rounded bg-slate-700" />
        <div className="h-3 w-20 rounded bg-slate-700" />
      </div>
      <div className="h-4 w-3/4 rounded bg-slate-700" />
    </div>
  );
}

export default function ChangesTab({ competitorId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePageChanges(competitorId, page);

  const changes    = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageSize   = data?.pageSize ?? 20;

  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <SkeletonChange key={i} />)}</div>;
  }

  if (changes.length === 0) {
    return <EmptyState title="No page changes detected" message="No changes have been detected on this competitor's pages yet." />;
  }

  return (
    <div className="space-y-4">
      {changes.map((change) => {
        const severityClass   = SEVERITY[change.severity]   ?? SEVERITY.Low;
        const changeTypeClass = CHANGE_TYPE[change.changeType] ?? CHANGE_TYPE.Other;

        return (
          <div key={change.id} className="rounded-xl border border-slate-700 bg-slate-800 p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Link2 size={14} className="shrink-0 text-indigo-400" />
                <span className="truncate text-xs text-indigo-400 font-medium">{change.pageUrl ?? '—'}</span>
              </div>
              <span className="shrink-0 text-xs text-slate-500">{fmt(change.detectedAt)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${changeTypeClass}`}>
                {change.changeType ?? 'Other'}
              </span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${severityClass}`}>
                {change.severity ?? 'Low'}
              </span>
            </div>

            {change.changeSummary && (
              <p className="text-sm text-slate-300">{change.changeSummary}</p>
            )}
          </div>
        );
      })}

      <Pagination currentPage={page} totalCount={totalCount} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
