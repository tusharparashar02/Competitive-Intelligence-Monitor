import { useNavigate } from 'react-router-dom';
import { Globe, Clock, Bell } from 'lucide-react';

const sentimentConfig = {
  positive: { label: 'Positive', dot: 'bg-green-400', score: 'text-green-400', bar: 'bg-green-400' },
  neutral:  { label: 'Neutral',  dot: 'bg-slate-400', score: 'text-slate-400', bar: 'bg-slate-400' },
  negative: { label: 'Negative', dot: 'bg-red-400',   score: 'text-red-400',   bar: 'bg-red-400'   },
};

export default function CompetitorCard({ competitor }) {
  const navigate = useNavigate();
  const { id, name, url, lastMonitored, alertCount, sentiment, sentimentScore, sentimentWidth } = competitor;
  const s = sentimentConfig[sentiment];

  return (
    <div
      onClick={() => navigate(`/competitors/${id}`)}
      className="cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-5 flex flex-col gap-4 hover:border-indigo-500/60 hover:bg-slate-750 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white text-sm">{name}</h3>
          <div className="flex items-center gap-1 mt-0.5 text-slate-400">
            <Globe size={12} />
            <span className="text-xs">{url}</span>
          </div>
        </div>
        {alertCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
            <Bell size={10} />
            {alertCount}
          </span>
        )}
      </div>

      {/* Sentiment */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <span className="text-xs text-slate-400">Sentiment</span>
          </div>
          <span className={`text-xs font-semibold ${s.score}`}>{sentimentScore}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-700">
          <div className={`h-1.5 rounded-full transition-all ${s.bar} ${sentimentWidth}`} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1 text-slate-500">
        <Clock size={11} />
        <span className="text-xs">Monitored {lastMonitored}</span>
      </div>
    </div>
  );
}
