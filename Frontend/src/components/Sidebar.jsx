import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  Bell,
  Settings,
  X,
  TrendingUp,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/competitors', label: 'Competitors',  icon: Users },
  { to: '/reports',     label: 'Reports',      icon: FileBarChart2 },
  { to: '/alerts',      label: 'Alerts',       icon: Bell },
  { to: '/settings',    label: 'Settings',     icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900
          transform transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-400" size={22} />
            <span className="text-white font-semibold text-sm tracking-wide">CompeteIQ</span>
          </div>
          <button
            className="text-slate-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">Developed By: Tushar Parashar</p>
        </div>
      </aside>
    </>
  );
}
