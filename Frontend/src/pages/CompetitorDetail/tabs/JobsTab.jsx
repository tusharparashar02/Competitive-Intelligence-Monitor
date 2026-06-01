import { useState } from 'react';
import { Briefcase, ExternalLink } from 'lucide-react';
import { useJobs } from '../../../hooks/useIntelligence';
import Pagination from '../../../components/Pagination';
import EmptyState from '../../../components/EmptyState';

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse bg-slate-800">
      {[140, 80, 100, 80].map((w, j) => (
        <td key={j} className="px-4 py-3">
          <div className={`h-3 rounded bg-slate-700`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  ));
}

export default function JobsTab({ competitorId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useJobs(competitorId, page);

  const jobs       = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageSize   = data?.pageSize ?? 20;

  if (!isLoading && jobs.length === 0) {
    return <EmptyState title="No job postings found" message="No active job listings detected for this competitor yet." />;
  }

  return (
    <div className="space-y-3">
      {!isLoading && (
        <p className="text-xs text-slate-400">
          Showing {jobs.length} of {totalCount} jobs
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/60">
              {['Job Title', 'Department', 'Location', 'Posted Date'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {isLoading ? <SkeletonRows /> : jobs.map((job) => (
              <tr key={job.id} className="bg-slate-800 hover:bg-slate-700/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="shrink-0 text-indigo-400" />
                    {job.jobUrl
                      ? <a href={job.jobUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                          className="font-medium text-white hover:text-indigo-300 inline-flex items-center gap-1">
                          {job.title} <ExternalLink size={11} />
                        </a>
                      : <span className="font-medium text-white">{job.title}</span>
                    }
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-slate-300">
                    {job.department ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{job.location ?? '—'}</td>
                <td className="px-4 py-3 text-slate-400">{fmt(job.postedAt ?? job.scrapedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalCount={totalCount} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
