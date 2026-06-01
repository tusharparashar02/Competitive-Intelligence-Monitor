import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Trash2, Calendar, Clock, Briefcase, FileSearch, Star, ScrollText, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCompetitor, useDeleteCompetitor } from '../../hooks/useCompetitors';
import ConfirmModal from '../../components/ConfirmModal';
import SkeletonCard from '../../components/SkeletonCard';
import JobsTab from './tabs/JobsTab';
import ChangesTab from './tabs/ChangesTab';
import ReviewsTab from './tabs/ReviewsTab';
import ChangelogTab from './tabs/ChangelogTab';

const TABS = [
  { key: 'jobs',      label: 'Jobs',         icon: Briefcase  },
  { key: 'changes',   label: 'Page Changes', icon: FileSearch },
  { key: 'reviews',   label: 'Reviews',      icon: Star       },
  { key: 'changelog', label: 'Changelog',    icon: ScrollText },
];

function fmt(dateStr) {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CompetitorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('jobs');
  const [showModal, setShowModal] = useState(false);

  const { competitor, isLoading } = useCompetitor(id);
  const { deleteCompetitor, isDeleting } = useDeleteCompetitor();

  const handleDelete = async () => {
    await deleteCompetitor(id);
    toast.success('Competitor deleted.');
    navigate('/competitors');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="h-12 animate-pulse rounded-xl bg-slate-800 border border-slate-700" />
      </div>
    );
  }

  if (!competitor) {
    return <p className="text-sm text-slate-400">Competitor not found.</p>;
  }

  const displayUrl = competitor.websiteUrl?.replace(/^https?:\/\//, '') ?? '';

  return (
    <>
      <div className="space-y-6">
        {/* ── Header card ── */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{competitor.name}</h2>
                {competitor.isActive
                  ? <span className="flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400"><CheckCircle size={9} />Active</span>
                  : <span className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400"><XCircle size={9} />Inactive</span>
                }
              </div>

              <a
                href={competitor.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink size={13} />
                {displayUrl}
              </a>

              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar size={12} />
                  <span>Added {fmt(competitor.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>Last monitored {fmt(competitor.lastMonitoredAt)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 self-start rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 rounded-xl border border-slate-700 bg-slate-800 p-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${activeTab === key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'jobs'      && <JobsTab      competitorId={id} />}
        {activeTab === 'changes'   && <ChangesTab   competitorId={id} />}
        {activeTab === 'reviews'   && <ReviewsTab   competitorId={id} />}
        {activeTab === 'changelog' && <ChangelogTab competitorId={id} />}
      </div>

      {showModal && (
        <ConfirmModal
          title="Delete Competitor"
          message={`Are you sure you want to delete "${competitor.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
          loading={isDeleting}
        />
      )}
    </>
  );
}
