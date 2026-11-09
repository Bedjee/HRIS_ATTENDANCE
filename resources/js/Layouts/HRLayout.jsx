import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import LogoutButton from '@/Components/LogoutButton';
import {
  Menu,
  X,
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  QrCode,
  Users,
  FileText,
  Layers,
  GitBranch,
  User as UserIcon,
  BarChart3,
  ShieldCheck,
  Star,
} from 'lucide-react';

/* ---------------------------------- */
/* Compact parol mark                 */
/* ---------------------------------- */
function ParolMark({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="navParolBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M50 6 L61.2 34.6 L91.9 36.4 L68.1 55.9 L75.9 85.6 L50 69 L24.1 85.6 L31.9 55.9 L8.1 36.4 L38.8 34.6 Z"
        fill="url(#navParolBody)"
        stroke="#fffbeb"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M50 28 L55.6 42.3 L70.9 43.2 L59.0 52.9 L63.0 67.7 L50 59.5 L37.0 67.7 L41.0 52.9 L29.1 43.2 L44.4 42.3 Z"
        fill="#fffbeb"
        opacity="0.92"
      />
      <circle cx="50" cy="50" r="4.5" fill="#fde68a" />
    </svg>
  );
}

/* ---------------------------------- */
/* Slim banderitas strip              */
/* ---------------------------------- */
function Banderitas({ className = '' }) {
  const palette = ['#dc2626', '#fbbf24', '#16a34a', '#f59e0b', '#ef4444', '#22c55e'];
  const count = 20;
  const flags = Array.from({ length: count }).map((_, i) => {
    const t = i / (count - 1);
    return {
      color: palette[i % palette.length],
      sag: Math.sin(Math.PI * t) * 6,
      delay: `${(i % 7) * 0.24}s`,
    };
  });

  return (
    <div className={`pointer-events-none relative w-full ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-x-0 top-0 w-full h-3 text-amber-300/60"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 1 Q 50 10 100 1"
          stroke="currentColor"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative flex justify-between items-start px-1 pt-0.5">
        {flags.map((f, i) => (
          <div
            key={i}
            className="w-1.5 h-2 sm:w-2 sm:h-2.5"
            style={{
              marginTop: `${f.sag}px`,
              backgroundColor: f.color,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transformOrigin: 'top center',
              animation: 'hrFlagSway 3.4s ease-in-out infinite',
              animationDelay: f.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HRLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { name: 'Dashboard', route: 'hr.dashboard', icon: LayoutDashboard },
    { name: 'Events', route: 'hr.events.index', icon: CalendarDays },
    { name: 'Scan Attendance', route: 'hr.attendance.scan', icon: QrCode },
    { name: 'Employees', route: 'hr.employees.index', icon: Users },
    { name: 'Import Employees', route: 'hr.employees.import', icon: UserPlus },
    { name: 'Clusters', route: 'hr.clusters.index', icon: Layers },
    { name: 'Departments', route: 'hr.departments.index', icon: GitBranch },
    { name: 'Attendance', route: 'hr.reports.index', icon: FileText },
    { name: 'Analytics', route: 'hr.analytics', icon: BarChart3 },
    { name: 'HR Users', route: 'hr.users.index', icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f1e8]">
      {/* ========== SIDEBAR — deep pine green ========== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-[#0e2c1a] via-[#0a2315] to-[#071a10] transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ---- Brand header ---- */}
        <div className="relative flex h-16 items-center justify-between border-b border-[#1c4128] px-4">
          {/* warm glow behind the parol */}
          <div className="pointer-events-none absolute -top-8 left-2 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />

          <Link href="/" className="relative flex items-center">
            <ApplicationLogo className="h-8 w-auto fill-current text-emerald-50" />
            <ParolMark className="ml-2 h-5 w-5 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)] animate-[hrParolSway_7s_ease-in-out_infinite]" />
            <span className="ml-2 text-lg font-semibold text-emerald-50">HR Portal</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="relative rounded-md p-2 text-[#9dc4ab] hover:bg-[#1a4028] hover:text-amber-100 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>

          {/* banderitas pinned under the header */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-3 h-3">
            <Banderitas className="h-3" />
          </div>
        </div>

        {/* ---- Navigation ---- */}
        <nav className="mt-6 px-2 pb-24">
          {navItems.map((item) => {
            const isActive = route().current(item.route) || route().current(item.route + '.*');
            return (
              <Link
                key={item.name}
                href={route(item.route)}
                className={`
                  group mb-0.5 flex items-center rounded-lg px-4 py-2.5 text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-[#1e4830] to-[#173a25] text-amber-50 shadow-[inset_4px_0_0_0_#fbbf24]'
                    : 'text-[#a8c9b4] hover:bg-[#1a4028] hover:text-amber-100'
                  }
                `}
                onClick={closeSidebar}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                    isActive
                      ? 'text-amber-300'
                      : 'text-[#6a9078] group-hover:text-amber-200'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* ---- Sidebar footer (user + Pasko greeting) ---- */}
        <div className="absolute bottom-0 w-full border-t border-[#1c4128] bg-gradient-to-t from-amber-950/40 via-[#071a10]/20 to-transparent p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-50">{user.username}</p>
              <p className="text-xs text-[#7a9d87]">{user.email}</p>
              <p className="mt-1 flex items-center gap-1 font-serif text-[11px] italic text-amber-300/85">
                <Star className="h-3 w-3 text-amber-400/80" />
                Maligayang Pasko
              </p>
            </div>
            <LogoutButton className="rounded-md p-2 text-[#9dc4ab] hover:bg-[#1a4028] hover:text-amber-100" />
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        {/* ========== TOP HEADER — warm ivory ========== */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#ead9b8] bg-[#fdfaf3] px-4 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 text-stone-500 hover:bg-amber-100/60 hover:text-[#0e2c1a] lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-2 flex items-center gap-2 lg:hidden">
              <ParolMark className="h-5 w-5" />
              <span className="text-lg font-semibold text-[#0e2c1a]">HR Portal</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Dropdown>
                <Dropdown.Trigger>
                  <button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:ring-offset-2">
                    <span className="sr-only">User menu</span>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 text-[#0e2c1a] ring-1 ring-amber-300/50">
                      <UserIcon className="h-5 w-5" />
                      {/* tiny gold star badge */}
                      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 text-[6px] text-amber-900 shadow-[0_0_6px_rgba(251,191,36,0.7)]">
                        <Star className="h-2 w-2 fill-current" />
                      </span>
                    </div>
                    <span className="ml-2 hidden text-sm font-medium text-[#1a3d27] sm:inline">
                      {user.username}
                    </span>
                  </button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                </Dropdown.Content>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* ========== MAIN ========== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* ---- Global keyframes ---- */}
      <style>{`
        @keyframes hrParolSway {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          50%      { transform: rotate(3deg) translateY(-4px); }
        }
        @keyframes hrFlagSway {
          0%, 100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}