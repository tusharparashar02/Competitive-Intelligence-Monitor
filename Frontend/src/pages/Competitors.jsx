import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Clock, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useCompetitors, useDeleteCompetitor } from '../hooks/useCompetitors';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

function CompetitorRow({ competitor, onDeleteClick }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/competitors/${competitor.id}`)}
      className="cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-5 flex items-center justify-between gap-4
        hover:border-indigo-500/50 hover:bg-slate-750 transition-colors"
    >
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white text-sm truncate">{competitor.name}</h3>
          {competitor.isActive
            ? <span className="flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400"><CheckCircle size={9} />Active</span>
            : <span className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400"><XCircle size={9} />Inactive</span>
          }
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Globe size={11} />
          <span className="text-xs truncate">{competitor.websiteUrl}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Clock size={11} />
          <span className="text-xs">Last monitored {timeAgo(competitor.lastMonitoredAt)}</span>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDeleteClick(competitor); }}
        className="shrink-0 flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5
          text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
      >
        <Trash2 size={12} /> Delete
      </button>
    </div>
  );
}

export default function Competitors() {
  const { competitors, isLoading } = useCompetitors();
  const { deleteCompetitor, isDeleting } = useDeleteCompetitor();
  const [target, setTarget] = useState(null); // competitor to delete

  const handleConfirmDelete = async () => {
    await deleteCompetitor(target.id);
    setTarget(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">
          Competitors
          {!isLoading && <span className="ml-2 text-slate-400 font-normal">({competitors.length})</span>}
        </h2>
        <Link
          to="/competitors/add"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white
            hover:bg-indigo-500 transition-colors"
        >
          <Plus size={14} /> Add Competitor
        </Link>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : competitors.length === 0 ? (
        <EmptyState
          title="No competitors yet"
          message="Add your first competitor to start monitoring their activity."
        >
          <Link
            to="/competitors/add"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <Plus size={14} /> Add Competitor
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {competitors.map((c) => (
            <CompetitorRow key={c.id} competitor={c} onDeleteClick={setTarget} />
          ))}
        </div>
      )}

      {target && (
        <ConfirmModal
          title="Delete Competitor"
          message={`Are you sure you want to delete "${target.name}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTarget(null)}
          loading={isDeleting}
        />
      )}
    </div>
  );
}
