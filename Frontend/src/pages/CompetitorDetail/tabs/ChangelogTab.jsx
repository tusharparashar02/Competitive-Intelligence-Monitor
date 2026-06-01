import { useState } from 'react';
import { useChangelog } from '../../../hooks/useIntelligence';
import Pagination from '../../../components/Pagination';
import EmptyState from '../../../components/EmptyState';

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkeletonEntry() {
  return (
    <div className="animate-pulse relative pb-8 last:pb-0">
      <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-600 bg-slate-900" />
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full bg-slate-700" />
          <div className="h-4 w-24 rounded bg-slate-700/60" />
        </div>
        <div className="h-4 w-1/2 rounded bg-slate-700" />
        <div className="h-3 w-full rounded bg-slate-700/60" />
      </div>
    </div>
  );
}

export default function ChangelogTab({ competitorId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useChangelog(competitorId, page);

  const entries    = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageSize   = data?.pageSize ?? 20;

  if (isLoading) {
    return (
      <div className="relative pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-700" />
        {Array.from({ length: 4 }).map((_, i) => <SkeletonEntry key={i} />)}
      </div>
    );
  }

  if (entries.length === 0) {
    return <EmptyState title="No changelog entries" message="No product updates have been detected for this competitor yet." />;
  }

  return (
    <div className="space-y-4">
      <div className="relative pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-700" />

        {entries.map((entry) => (
          <div key={entry.id} className="relative pb-8 last:pb-0">
            <div className="absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-indigo-500 bg-slate-900" />

            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs text-slate-500">{fmt(entry.publishedAt)}</span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">{entry.title ?? 'Untitled'}</p>
              {entry.description && (
                <p className="text-sm text-slate-400 leading-relaxed">{entry.description}</p>
              )}
              {entry.entryUrl && (
                <a
                  href={entry.entryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  View entry →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} totalCount={totalCount} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
