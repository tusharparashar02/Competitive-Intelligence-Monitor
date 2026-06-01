import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl
        animate-[slideUp_0.2s_ease-out]
        ${isSuccess
          ? 'bg-green-500/10 border-green-500/30 text-green-400'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}
    >
      {isSuccess
        ? <CheckCircle size={18} className="shrink-0 mt-0.5" />
        : <XCircle    size={18} className="shrink-0 mt-0.5" />
      }
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
