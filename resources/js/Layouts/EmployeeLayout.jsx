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
};

export default function EmployeeLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const themeName = user?.theme || 'navy';
  const theme = themes[themeName] || themes.navy;

  const navItems = [
    { name: 'Dashboard', route: 'employee.dashboard', icon: LayoutDashboard },
    { name: 'My QR Code', route: 'employee.qr', icon: QrCode },
    { name: 'My Attendance', route: 'employee.attendance', icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50" data-theme={themeName}>
      {/* Fixed Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col ${theme.sidebar} shadow-2xl shadow-black/10 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <ApplicationLogo className="h-8 w-auto fill-current text-white" />
            <span className={`text-base font-semibold tracking-tight ${theme.logo}`}>
              Employee Portal
            </span>
          </Link>
          <button
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-white/60 transition-colors duration-200 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              route().current(item.route) || route().current(item.route + '.*');
            return (
              <Link
                key={item.name}
                href={route(item.route)}
                onClick={closeSidebar}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                  isActive ? theme.sidebarActive : theme.sidebarItem
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className={`shrink-0 border-t ${theme.sidebarBorder} p-4`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.username}</p>
              <p className={`truncate text-xs ${theme.sidebarFooterText}`}>{user.email}</p>
            </div>
            <LogoutButton className="rounded-lg p-1.5 text-white/60 transition-colors duration-200" />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b ${theme.header} ${theme.headerText} px-4 shadow-sm`}
        >
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
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