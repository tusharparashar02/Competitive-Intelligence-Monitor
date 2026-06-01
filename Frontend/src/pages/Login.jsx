import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, CheckCircle, ServerCrash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkApiConnection } from '../utils/apiHealthCheck';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const location   = useLocation();
  const successMsg = location.state?.message ?? '';

  const [form,      setForm]      = useState({ email: '', password: '' });
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showPw,    setShowPw]    = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  useEffect(() => {
    checkApiConnection().then(setApiOnline);
  }, []);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">CompeteIQ</h1>
          <p className="text-sm text-slate-400">Sign in to your account</p>
        </div>

        {/* API unreachable warning */}
        {!apiOnline && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5">
            <ServerCrash size={14} className="shrink-0 mt-0.5 text-yellow-400" />
            <p className="text-xs text-yellow-300">
              Cannot connect to server. Make sure the backend is running at{' '}
              <span className="font-mono font-semibold">http://localhost:5011</span>
            </p>
          </div>
        )}

        {/* Card */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Success banner (from register redirect) */}
            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/25 bg-green-500/10 px-3 py-2.5">
                <CheckCircle size={14} className="shrink-0 text-green-400" />
                <p className="text-xs text-green-400">{successMsg}</p>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2.5">
                <AlertCircle size={14} className="shrink-0 text-red-400" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none hover:border-slate-500 focus:border-transparent focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-500 outline-none hover:border-slate-500 focus:border-transparent focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">
            Demo credentials:{' '}
            <span className="font-mono font-semibold text-slate-300">test@gmail.com</span>
            {' / '}
            <span className="font-mono font-semibold text-slate-300">test123</span>
          </p>
        </div>

        {/* Footer link */}
        <p className="mt-4 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
