const CONFIG = {
  connected:    { dot: 'bg-green-400',  pulse: 'animate-pulse', label: 'Live',         tip: 'Real-time alerts connected'     },
  reconnecting: { dot: 'bg-yellow-400', pulse: 'animate-pulse', label: 'Reconnecting', tip: 'Attempting to reconnect…'        },
  disconnected: { dot: 'bg-slate-500',  pulse: '',              label: 'Offline',       tip: 'Real-time alerts disconnected'  },
};

export default function ConnectionStatus({ status = 'disconnected' }) {
  const { dot, pulse, label, tip } = CONFIG[status] ?? CONFIG.disconnected;

  return (
    <div className="group fixed bottom-4 right-4 z-40">
      <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/90 px-3 py-1.5 shadow-lg backdrop-blur-sm cursor-default">
        <span className={`h-2 w-2 rounded-full ${dot} ${pulse}`} />
        <span className="text-[11px] font-medium text-slate-400">{label}</span>
      </div>

      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 shadow-xl">
          <p className="text-xs text-slate-300 whitespace-nowrap">{tip}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">SignalR · /hubs/notifications</p>
        </div>
      </div>
    </div>
  );
}
