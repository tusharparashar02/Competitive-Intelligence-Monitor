import { useState } from 'react';
import { ArrowUp, ExternalLink } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useRedditMentions, useSentimentTrend } from '../../../hooks/useIntelligence';
import Pagination from '../../../components/Pagination';
import EmptyState from '../../../components/EmptyState';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="font-semibold text-indigo-400">Score: {payload[0].value?.toFixed(2)}</p>
    </div>
  );
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewsTab({ competitorId }) {
  const [page, setPage] = useState(1);

  const { data: mentionsData, isLoading: loadingMentions } = useRedditMentions(competitorId, page);
  const { sentiment, isLoading: loadingSentiment }         = useSentimentTrend(competitorId, 30);

  const mentions   = mentionsData?.items ?? [];
  const totalCount = mentionsData?.totalCount ?? 0;
  const pageSize   = mentionsData?.pageSize ?? 20;

  // Build chart data: sentiment is a single average score from the API
  // We display it as a flat reference line with the value
  const chartData = sentiment !== null
    ? [{ label: '30d avg', score: Number((sentiment * 100).toFixed(1)) }]
    : [];

  return (
    <div className="space-y-6">
      {/* Sentiment chart */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Sentiment Score — Last 30 Days</h3>

        {loadingSentiment ? (
          <div className="animate-pulse h-12 rounded bg-slate-700 mt-4" />
        ) : sentiment === null ? (
          <EmptyState title="No sentiment data yet" />
        ) : (
          <div className="mt-4 flex items-center gap-4">
            <div className={`text-4xl font-bold ${sentiment >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(sentiment * 100).toFixed(0)}
            </div>
            <div className="text-xs text-slate-400">
              <p>Average sentiment score</p>
              <p className="text-slate-500">Range: −100 (negative) to +100 (positive)</p>
            </div>
          </div>
        )}
      </div>

      {/* Reddit mentions */}
      <div className="rounded-xl border border-slate-700 bg-slate-800">
        <div className="border-b border-slate-700 px-5 py-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Reddit Mentions</h3>
          {!loadingMentions && <span className="text-xs text-slate-500">{totalCount} total</span>}
        </div>

        {loadingMentions ? (
          <div className="divide-y divide-slate-700/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-start gap-4 px-5 py-3.5">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-slate-700" />
                  <div className="h-3 w-1/3 rounded bg-slate-700/60" />
                </div>
              </div>
            ))}
          </div>
        ) : mentions.length === 0 ? (
          <EmptyState title="No Reddit mentions found" message="No Reddit posts have been scraped for this competitor yet." />
        ) : (
          <>
            <ul className="divide-y divide-slate-700/60">
              {mentions.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 px-5 py-3.5 hover:bg-slate-700/30 transition-colors">
                  <div className="min-w-0">
                    {m.postUrl
                      ? <a href={m.postUrl} target="_blank" rel="noreferrer"
                           className="text-sm text-slate-200 hover:text-indigo-300 leading-snug inline-flex items-center gap-1">
                           {m.postTitle} <ExternalLink size={11} className="shrink-0" />
                         </a>
                      : <p className="text-sm text-slate-200 leading-snug">{m.postTitle}</p>
                    }
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs font-medium text-indigo-400">r/{m.subreddit}</span>
                      <span className="text-xs text-slate-500">{fmt(m.postedAt)}</span>
                      <span className={`text-xs font-medium ${m.sentimentScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {m.sentimentScore >= 0 ? '+' : ''}{(m.sentimentScore * 100).toFixed(0)} sentiment
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-slate-400">
                    <ArrowUp size={12} />
                    <span className="text-xs font-medium">{m.upvotes}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-5 pb-4">
              <Pagination currentPage={page} totalCount={totalCount} pageSize={pageSize} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
