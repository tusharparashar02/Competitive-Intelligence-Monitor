import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', message, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700/50 mb-4">
        <Inbox size={24} className="text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-300">{title}</p>
      {message && <p className="mt-1 text-xs text-slate-500 max-w-xs">{message}</p>}
      {children}
    </div>
  );
}
