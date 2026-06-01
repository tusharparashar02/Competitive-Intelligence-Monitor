export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-700 bg-slate-800 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-700" />
          <div className="h-3 w-24 rounded bg-slate-700/60" />
        </div>
        <div className="h-5 w-10 rounded-full bg-slate-700/60" />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded bg-slate-700/60" />
          <div className="h-3 w-8 rounded bg-slate-700/60" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-700" />
      </div>
      <div className="h-3 w-28 rounded bg-slate-700/60" />
    </div>
  );
}
