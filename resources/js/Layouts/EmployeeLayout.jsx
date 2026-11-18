import { useState } from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import LogoutButton from '@/Components/LogoutButton';
import ThemeSwitcher from '@/Components/ThemeSwitcher';
import HelpAssistant from '@/Components/HelpAssistant';
import {
  Menu,
  X,
  LayoutDashboard,
  QrCode,
  History,
  User as UserIcon,
} from 'lucide-react';

// Theme configuration
const themes = {
  navy: {
    sidebar: 'bg-navy-800',
    sidebarItem: 'text-navy-300',
    sidebarActive: 'bg-navy-700 text-white',
    sidebarBorder: 'border-navy-700',
    sidebarFooterText: 'text-navy-300',
    header: 'bg-navy-50 border-navy-200',
    headerText: 'text-navy-800',
    headerHover: 'hover:bg-navy-100 hover:text-navy-700',
    dropdownIconBg: 'bg-navy-100 text-navy-700',
    dropdownFocus: 'focus:ring-navy-500',
    logo: 'text-white',
  },
  crimson: {
    sidebar: 'bg-crimson-800',
    sidebarItem: 'text-crimson-300',
    sidebarActive: 'bg-crimson-700 text-white',
    sidebarBorder: 'border-crimson-700',
    sidebarFooterText: 'text-crimson-300',
    header: 'bg-crimson-50 border-crimson-200',
    headerText: 'text-crimson-800',
    headerHover: 'hover:bg-crimson-100 hover:text-crimson-700',
    dropdownIconBg: 'bg-crimson-100 text-crimson-700',
    dropdownFocus: 'focus:ring-crimson-500',
    logo: 'text-white',
  },
  brown: {
    sidebar: 'bg-brown-800',
    sidebarItem: 'text-brown-300',
    sidebarActive: 'bg-brown-700 text-white',
    sidebarBorder: 'border-brown-700',
    sidebarFooterText: 'text-brown-300',
    header: 'bg-brown-50 border-brown-200',
    headerText: 'text-brown-800',
    headerHover: 'hover:bg-brown-100 hover:text-brown-700',
    dropdownIconBg: 'bg-brown-100 text-brown-700',
    dropdownFocus: 'focus:ring-brown-500',
    logo: 'text-white',
  },
  black: {
    sidebar: 'bg-black-800',
    sidebarItem: 'text-black-300',
    sidebarActive: 'bg-black-700 text-white',
    sidebarBorder: 'border-black-700',
    sidebarFooterText: 'text-black-300',
    header: 'bg-black-50 border-black-200',
    headerText: 'text-black-800',
    headerHover: 'hover:bg-black-100 hover:text-black-700',
    dropdownIconBg: 'bg-black-100 text-black-700',
    dropdownFocus: 'focus:ring-black-500',
    logo: 'text-white',
  },
  yellow: {
    sidebar: 'bg-yellow-800',
    sidebarItem: 'text-yellow-300',
    sidebarActive: 'bg-yellow-700 text-white',
    sidebarBorder: 'border-yellow-700',
    sidebarFooterText: 'text-yellow-300',
    header: 'bg-yellow-50 border-yellow-200',
    headerText: 'text-yellow-800',
    headerHover: 'hover:bg-yellow-100 hover:text-yellow-700',
    dropdownIconBg: 'bg-yellow-100 text-yellow-700',
    dropdownFocus: 'focus:ring-yellow-500',
    logo: 'text-white',
  },
  green: {
    sidebar: 'bg-green-800',
    sidebarItem: 'text-green-300',
    sidebarActive: 'bg-green-700 text-white',
    sidebarBorder: 'border-green-700',
    sidebarFooterText: 'text-green-300',
    header: 'bg-green-50 border-green-200',
    headerText: 'text-green-800',
    headerHover: 'hover:bg-green-100 hover:text-green-700',
    dropdownIconBg: 'bg-green-100 text-green-700',
    dropdownFocus: 'focus:ring-green-500',
    logo: 'text-white',
  },
  violet: {
    sidebar: 'bg-violet-800',
    sidebarItem: 'text-violet-300',
    sidebarActive: 'bg-violet-700 text-white',
    sidebarBorder: 'border-violet-700',
    sidebarFooterText: 'text-violet-300',
    header: 'bg-violet-50 border-violet-200',
    headerText: 'text-violet-800',
    headerHover: 'hover:bg-violet-100 hover:text-violet-700',
    dropdownIconBg: 'bg-violet-100 text-violet-700',
    dropdownFocus: 'focus:ring-violet-500',
    logo: 'text-white',
  },
  christmas: {
    // Deep Simbang Gabi crimson -> pine evergreen gradient with warm gold border
    sidebar:
      'bg-gradient-to-b from-[#4a0811] via-[#710f1d] to-[#0b3326] border-r border-amber-400/25',
    sidebarItem:
      'text-amber-100/80 hover:bg-amber-400/10 hover:text-amber-50 hover:translate-x-0.5',
    // Active item glows like a lit Capiz parol star
    sidebarActive:
      'bg-gradient-to-r from-amber-400/25 via-red-500/25 to-emerald-500/20 text-amber-50 ring-1 ring-amber-300/60 shadow-lg shadow-amber-500/20',
    sidebarBorder: 'border-amber-300/20',
    sidebarFooterText: 'text-amber-200/75',
    // Warm luminous Noche Buena ivory-gold header keeping controls 100% legible
    header:
      'bg-gradient-to-r from-[#fff8eb] via-[#fef1d8] to-[#f1faf4] border-amber-300/80',
    headerText: 'text-[#6e101c]',
    headerHover: 'hover:bg-amber-200/50 hover:text-[#4a0811]',
    dropdownIconBg:
      'bg-gradient-to-br from-red-600 to-amber-500 text-amber-50 ring-2 ring-amber-300/70',
    dropdownFocus: 'focus:ring-amber-500',
    logo: 'text-amber-50',
  },
};

/* ────────────────────────────────────────────────────────────
   PASKONG PINOY SIDEBAR & HEADER DECORATIONS
   ──────────────────────────────────────────────────────────── */

const SidebarChristmasAnimations = () => (
  <style>{`
    @keyframes layoutParolSway {
      0%, 100% { transform: rotate(-4deg) translateY(0px); }
      50% { transform: rotate(4deg) translateY(2px); }
    }
    @keyframes layoutRaysSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes layoutStarTwinkle {
      0%, 100% { opacity: 0.35; transform: scale(0.8) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(18deg); }
    }
    @keyframes layoutBulbChase {
      0%, 100% { opacity: 0.45; transform: scale(0.9); filter: brightness(0.85); }
      50% { opacity: 1; transform: scale(1.2); filter: brightness(1.35); }
    }
    @keyframes layoutBanderitas {
      0%, 100% { transform: skewX(-2deg) scaleY(0.95); }
      50% { transform: skewX(2deg) scaleY(1.05); }
    }

    .layout-parol-sway {
      transform-origin: top center;
      animation: layoutParolSway 5.4s ease-in-out infinite;
    }
    .layout-rays-spin {
      transform-origin: 60px 56px;
      animation: layoutRaysSpin 34s linear infinite;
    }
    .layout-star-twinkle {
      animation: layoutStarTwinkle 2.6s ease-in-out infinite;
    }
    .layout-bulb-chase {
      animation: layoutBulbChase 2.1s ease-in-out infinite;
    }
    .layout-banderitas {
      transform-origin: top center;
      animation: layoutBanderitas 3.6s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .layout-parol-sway,
      .layout-rays-spin,
      .layout-star-twinkle,
      .layout-bulb-chase,
      .layout-banderitas {
        animation: none !important;
      }
    }
  `}</style>
);

/** Compact swaying Capiz Parol accent inside the sidebar. */
const SidebarParol = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 136"
    className={`layout-parol-sway ${className}`}
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="sidebarParolHalo" cx="0.5" cy="0.42" r="0.5">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.65" />
        <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="sidebarParolGold" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="50%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    <circle cx="60" cy="56" r="54" fill="url(#sidebarParolHalo)" />
    <circle
      cx="60"
      cy="56"
      r="39"
      stroke="#fde047"
      strokeOpacity="0.45"
      strokeWidth="1.2"
      strokeDasharray="3 3"
    />

    <g className="layout-rays-spin">
      {Array.from({ length: 12 }).map((_, i) => {
        const palette = ['#fde047', '#ef4444', '#22c55e'];
        return (
          <rect
            key={i}
            x="58.75"
            y="10"
            width="2.5"
            height="11"
            rx="1.25"
            fill={palette[i % 3]}
            opacity="0.85"
            transform={`rotate(${i * 30} 60 56)`}
          />
        );
      })}
    </g>

    <polygon
      points="60,22 67,44 90,44 72,58 79,80 60,67 41,80 48,58 30,44 53,44"
      fill="#dc2626"
      fillOpacity="0.85"
      stroke="#fde68a"
      strokeWidth="1"
      transform="rotate(36 60 56) scale(0.84) translate(11.4 10.6)"
    />
    <polygon
      points="60,21 69,45 94,45 74,60 81,84 60,70 39,84 46,60 26,45 51,45"
      fill="url(#sidebarParolGold)"
      stroke="#fffbeb"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="60" cy="56" r="7" fill="#fef3c7" />
    <circle cx="60" cy="56" r="3" fill="#ffffff" />

    {/* Buntot tassels */}
    <path d="M52 77 Q48 94 42 112" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M60 73 Q60 95 60 118" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
    <path d="M68 77 Q72 94 78 112" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** Miniature chasing Christmas lights divider for the sidebar or header. */
const SidebarFairyLights = ({ count = 9, className = '' }) => {
  const bulbs = [
    { color: '#ef4444', glow: 'rgba(239,68,68,0.8)' },
    { color: '#fde047', glow: 'rgba(253,224,71,0.9)' },
    { color: '#22c55e', glow: 'rgba(34,197,94,0.8)' },
    { color: '#fb923c', glow: 'rgba(251,146,60,0.8)' },
  ];
  return (
    <div
      className={`pointer-events-none flex items-center justify-between px-4 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const b = bulbs[i % bulbs.length];
        return (
          <span
            key={i}
            className="layout-bulb-chase h-2 w-1.5 rounded-full"
            style={{
              backgroundColor: b.color,
              boxShadow: `0 0 8px 2px ${b.glow}`,
              animationDelay: `${(i % 4) * 380}ms`,
            }}
          />
        );
      })}
    </div>
  );
};

export default function EmployeeLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const themeName = user?.theme || 'navy';
  const theme = themes[themeName] || themes.navy;
  const isChristmas = themeName === 'christmas';

  const navItems = [
    { name: 'Dashboard', route: 'employee.dashboard', icon: LayoutDashboard },
    { name: 'My QR Code', route: 'employee.qr', icon: QrCode },
    { name: 'My Attendance', route: 'employee.attendance', icon: History },
  ];

  return (
    <div
      className={`flex min-h-screen ${
        isChristmas
          ? 'bg-gradient-to-br from-[#fdf8f0] via-[#fdf8f0] to-[#fdf8f0]'
          : 'bg-gray-10'
      }`}
      data-theme={themeName}
    >
      {isChristmas && <SidebarChristmasAnimations />}

      {/* Fixed Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col overflow-hidden ${theme.sidebar} shadow-2xl shadow-black/25 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Paskong Pinoy Sidebar Ambient Layers */}
        {isChristmas && (
          <>
            {/* Subtle woven Capiz diamond lattice */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="sidebarCapizPattern"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M16 0 L32 16 L16 32 L0 16 Z"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="0.9"
                  />
                  <circle cx="16" cy="16" r="1.5" fill="#fde047" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sidebarCapizPattern)" />
            </svg>

            {/* Fluttering mini Banderitas along top edge */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between overflow-hidden"
              aria-hidden="true"
            >
              {Array.from({ length: 14 }).map((_, i) => {
                const colors = ['#ef4444', '#facc15', '#22c55e', '#fb923c'];
                return (
                  <span
                    key={i}
                    className="layout-banderitas h-2.5 w-4 shrink-0"
                    style={{
                      backgroundColor: colors[i % colors.length],
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      animationDelay: `${(i % 4) * 200}ms`,
                    }}
                  />
                );
              })}
            </div>

            {/* Warm Simbang Gabi candle glow at bottom */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-amber-500/15 via-emerald-500/5 to-transparent"
              aria-hidden="true"
            />
          </>
        )}

        {/* Brand */}
        <div
          className={`relative z-10 flex h-16 shrink-0 items-center justify-between px-5 ${
            isChristmas ? 'pt-1.5' : ''
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <ApplicationLogo
              className={`h-8 w-auto fill-current ${
                isChristmas ? 'text-amber-200 drop-shadow' : 'text-white'
              }`}
            />
            <span className={`text-base font-semibold tracking-tight ${theme.logo}`}>
              Employee Portal
            </span>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chasing Fairy Lights Divider under Brand */}
        {isChristmas && (
          <div className="relative z-10 border-b border-amber-300/20 pb-2.5">
            <SidebarFairyLights count={10} />
          </div>
        )}

        {/* Navigation */}
        <nav className="relative z-10 flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              route().current(item.route) || route().current(item.route + '.*');
            return (
              <Link
                key={item.name}
                href={route(item.route)}
                onClick={closeSidebar}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                  isActive ? theme.sidebarActive : theme.sidebarItem
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon
                    className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105 ${
                      isChristmas && isActive ? 'text-amber-300' : ''
                    }`}
                  />
                  <span>{item.name}</span>
                </span>

                {/* Twinkling Tala star indicator on active Christmas nav item */}
                {isChristmas && isActive && (
                  <svg
                    viewBox="0 0 24 24"
                    className="layout-star-twinkle h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                      fill="#fde047"
                    />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Hanging Parol Accent above Sidebar Footer */}
        {isChristmas && (
          <div
            className="pointer-events-none relative z-10 flex flex-col items-center justify-center pb-3 opacity-85"
            aria-hidden="true"
          >
            <div className="h-5 w-px bg-gradient-to-b from-amber-300/0 via-amber-300/60 to-amber-300/80" />
            <SidebarParol className="-mt-2 h-24 w-24" />
            <p className="-mt-2 text-[11px] font-medium tracking-wide text-amber-200/75">
              Maligayang Pasko
            </p>
          </div>
        )}

        {/* User footer */}
        <div
          className={`relative z-10 shrink-0 border-t ${theme.sidebarBorder} p-4 ${
            isChristmas ? 'bg-black/20 backdrop-blur-sm' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isChristmas
                  ? 'bg-gradient-to-br from-amber-400/30 to-red-600/30 text-amber-100 ring-1 ring-amber-300/60'
                  : 'bg-white/10 text-white'
              }`}
            >
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-medium ${
                  isChristmas ? 'text-amber-50' : 'text-white'
                }`}
              >
                {user.username}
              </p>
              <p className={`truncate text-xs ${theme.sidebarFooterText}`}>{user.email}</p>
            </div>
            <LogoutButton
              className={`rounded-lg p-1.5 transition-colors duration-200 ${
                isChristmas
                  ? 'text-amber-200/75 hover:bg-red-500/25 hover:text-amber-50'
                  : 'text-white/60'
              }`}
            />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b ${theme.header} ${theme.headerText} px-4 shadow-sm`}
        >
          {isChristmas && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-red-600 via-amber-400 to-emerald-600 opacity-85"
              aria-hidden="true"
            />
          )}

          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Open navigation"
              className={`rounded-lg p-2 transition-colors duration-200 ${theme.headerHover} lg:hidden`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className={`ml-2 text-base font-semibold ${theme.headerText} lg:hidden`}>
              Employee Portal
            </span>
          </div>

          {/* Right side: Theme Switcher + User Dropdown */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher currentTheme={user?.theme || 'navy'} />
            <div className="relative">
              <Dropdown>
                <Dropdown.Trigger>
                  <button
                    type="button"
                    className={`flex items-center rounded-full text-sm focus:outline-none focus:ring-2 ${theme.dropdownFocus} focus:ring-offset-2`}
                  >
                    <span className="sr-only">User menu</span>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.dropdownIconBg}`}
                    >
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <span
                      className={`ml-2 hidden text-sm font-medium ${theme.headerText} sm:inline`}
                    >
                      {user.username}
                    </span>
                  </button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                  <LogoutButton className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                    Log Out
                  </LogoutButton>
                </Dropdown.Content>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <HelpAssistant />
    </div>
  );
}