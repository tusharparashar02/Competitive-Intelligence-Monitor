import { Briefcase, DollarSign, Sparkles, TrendingDown } from 'lucide-react';

const TAG_CONFIG = {
  'Job Change':      { icon: Briefcase,    bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   text: 'text-blue-400'   },
  'Price Change':    { icon: DollarSign,   bg: 'bg-orange-500/10', border: 'border-orange-500/25', text: 'text-orange-400' },
  'New Feature':     { icon: Sparkles,     bg: 'bg-green-500/10',  border: 'border-green-500/25',  text: 'text-green-400'  },
  'Sentiment Shift': { icon: TrendingDown, bg: 'bg-red-500/10',    border: 'border-red-500/25',    text: 'text-red-400'    },
};

export default function ReportTag({ tag }) {
  const config = TAG_CONFIG[tag] ?? TAG_CONFIG['Job Change'];
  const Icon   = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold
      ${config.bg} ${config.border} ${config.text}`}>
      <Icon size={10} />
      {tag}
    </span>
  );
}
