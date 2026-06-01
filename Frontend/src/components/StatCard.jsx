import { Users, Bell, FileBarChart2, Zap } from 'lucide-react';

const iconMap = {
  users:      Users,
  bell:       Bell,
  'file-chart': FileBarChart2,
  zap:        Zap,
};

const colorMap = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
};

export default function StatCard({ label, value, color, icon }) {
  const Icon = iconMap[icon];
  const c = colorMap[color];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${c.bg} border ${c.border}`}>
        <Icon size={22} className={c.text} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}
