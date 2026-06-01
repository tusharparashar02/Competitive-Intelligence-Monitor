import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useUnreadCount } from '../hooks/useAlerts';

const pageTitles = {
  '/dashboard':   'Dashboard',
  '/competitors': 'Competitors',
  '/reports':     'Reports',
  '/alerts':      'Alerts',
  '/settings':    'Settings',
  '/job-postings':'Job Postings',
  '/pricing':     'Pricing Changes',
  '/changelogs':  'Changelogs',
  '/reviews':     'Review Sentiment',
};

export default function Navbar() {
  const { setSidebarOpen } = useAppContext();
  const { unreadCount } = useUnreadCount();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const title = pageTitles[pathname] ?? 'CompeteIQ';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';
  const displayName = user?.name ?? 'User';

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800 px-4 lg:px-6">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          className="text-slate-400 hover:text-white lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-base font-semibold text-white">{title}</h1>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative text-slate-400 hover:text-white">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-700"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-slate-300 sm:block">{displayName}</span>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl">
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                  onClick={handleLogout}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
