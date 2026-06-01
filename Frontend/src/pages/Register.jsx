import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, User, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Password strength ──────────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_CONFIG = [
  { label: '',       bars: 'bg-slate-700'  },
  { label: 'Weak',   bars: 'bg-red-500'    },
  { label: 'Fair',   bars: 'bg-orange-400' },
  { label: 'Good',   bars: 'bg-yellow-400' },
  { label: 'Strong', bars: 'bg-green-500'  },
];

function PasswordStrength({ password }) {
  const score = getStrength(password);
  if (!password) return null;
  const { label, bars } = STRENGTH_CONFIG[score];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= score ? bars : 'bg-slate-700'}`} />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${STRENGTH_CONFIG[score].bars.replace('bg-', 'text-')}`}>
        {label}
      </p>
    </div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, type, value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-500 outline-none hover:border-slate-500 focus:border-transparent focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [showCf,  setShowCf]  = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim())                               return 'Full name is required.';
    if (!form.email.trim())                              return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 8)                        return 'Password must be at least 8 characters.';
    if (getStrength(form.password) < 2)                  return 'Please choose a stronger password.';
    if (form.password !== form.confirm)                  return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">CompeteIQ</h1>
          <p className="text-sm text-slate-400">Create your account</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2.5">
                <AlertCircle size={14} className="shrink-0 text-red-400" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <Field label="Full Name" icon={User} type="text"  value={form.name}  onChange={set('name')}  placeholder="John Doe"          autoComplete="name"  />
            <Field label="Email"     icon={Mail} type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"    autoComplete="email" />

            {/* Password with strength meter */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-500 outline-none hover:border-slate-500 focus:border-transparent focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showCf ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-500 outline-none hover:border-slate-500 focus:border-transparent focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
                <button type="button" onClick={() => setShowCf((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showCf ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.confirm && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  {form.password === form.confirm
                    ? <><CheckCircle size={11} className="text-green-400" /><span className="text-[11px] text-green-400">Passwords match</span></>
                    : <><AlertCircle size={11} className="text-red-400"   /><span className="text-[11px] text-red-400">Passwords do not match</span></>
                  }
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-5 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
