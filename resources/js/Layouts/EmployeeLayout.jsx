import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import LogoutButton from '@/Components/LogoutButton';
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
    sidebar: 'bg-navy-800 border-navy-700 text-navy-300 hover:bg-navy-700',
    sidebarActive: 'bg-navy-700 text-white',
    sidebarBorder: 'border-navy-700',
    sidebarFooterText: 'text-navy-300',
    header: 'bg-navy-50 border-navy-200 text-navy-800',
    headerHover: 'hover:bg-navy-100 hover:text-navy-700',
    dropdownIconBg: 'bg-navy-100 text-navy-700',
    dropdownFocus: 'ring-navy-500',
    logo: 'text-white',
  },
  crimson: {
    sidebar: 'bg-crimson-800 border-crimson-700 text-crimson-300 hover:bg-crimson-700',
    sidebarActive: 'bg-crimson-700 text-white',
    sidebarBorder: 'border-crimson-700',
    sidebarFooterText: 'text-crimson-300',
    header: 'bg-crimson-50 border-crimson-200 text-crimson-800',
    headerHover: 'hover:bg-crimson-100 hover:text-crimson-700',
    dropdownIconBg: 'bg-crimson-100 text-crimson-700',
    dropdownFocus: 'ring-crimson-500',
    logo: 'text-white',
  },
  brown: {
    sidebar: 'bg-brown-800 border-brown-700 text-brown-300 hover:bg-brown-700',
    sidebarActive: 'bg-brown-700 text-white',
    sidebarBorder: 'border-brown-700',
    sidebarFooterText: 'text-brown-300',
    header: 'bg-brown-50 border-brown-200 text-brown-800',
    headerHover: 'hover:bg-brown-100 hover:text-brown-700',
    dropdownIconBg: 'bg-brown-100 text-brown-700',
    dropdownFocus: 'ring-brown-500',
    logo: 'text-white',
  },
  black: {
    sidebar: 'bg-black-800 border-black-700 text-black-300 hover:bg-black-700',
    sidebarActive: 'bg-black-700 text-white',
    sidebarBorder: 'border-black-700',
    sidebarFooterText: 'text-black-300',
    header: 'bg-black-50 border-black-200 text-black-800',
    headerHover: 'hover:bg-black-100 hover:text-black-700',
    dropdownIconBg: 'bg-black-100 text-black-700',
    dropdownFocus: 'ring-black-500',
    logo: 'text-white',
  },
  yellow: {
    sidebar: 'bg-yellow-800 border-yellow-700 text-yellow-300 hover:bg-yellow-700',
    sidebarActive: 'bg-yellow-700 text-white',
    sidebarBorder: 'border-yellow-700',
    sidebarFooterText: 'text-yellow-300',
    header: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    headerHover: 'hover:bg-yellow-100 hover:text-yellow-700',
    dropdownIconBg: 'bg-yellow-100 text-yellow-700',
    dropdownFocus: 'ring-yellow-500',
    logo: 'text-white',
  },
  green: {
    sidebar: 'bg-green-800 border-green-700 text-green-300 hover:bg-green-700',
    sidebarActive: 'bg-green-700 text-white',
    sidebarBorder: 'border-green-700',
    sidebarFooterText: 'text-green-300',
    header: 'bg-green-50 border-green-200 text-green-800',
    headerHover: 'hover:bg-green-100 hover:text-green-700',
    dropdownIconBg: 'bg-green-100 text-green-700',
    dropdownFocus: 'ring-green-500',
    logo: 'text-white',
  },
  violet: {
    sidebar: 'bg-violet-800 border-violet-700 text-violet-300 hover:bg-violet-700',
    sidebarActive: 'bg-violet-700 text-white',
    sidebarBorder: 'border-violet-700',
    sidebarFooterText: 'text-violet-300',
    header: 'bg-violet-50 border-violet-200 text-violet-800',
    headerHover: 'hover:bg-violet-100 hover:text-violet-700',
    dropdownIconBg: 'bg-violet-100 text-violet-700',
    dropdownFocus: 'ring-violet-500',
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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${theme.sidebar} transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className={`flex h-16 items-center justify-between border-b ${theme.sidebarBorder} px-4`}>
          <Link href="/" className="flex items-center">
            <ApplicationLogo className="h-8 w-auto fill-current text-white" />
            <span className={`ml-2 text-lg font-semibold ${theme.logo}`}>Employee Portal</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 px-2">
          {navItems.map((item) => {
            const isActive = route().current(item.route) || route().current(item.route + '.*');
            return (
              <Link
                key={item.name}
                href={route(item.route)}
                className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? theme.sidebarActive
                    : `${theme.sidebar} hover:${theme.sidebarActive.split(' ')[0]}`
                }`}
                onClick={closeSidebar}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={`absolute bottom-0 w-full border-t ${theme.sidebarBorder} p-4`}>
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user.username}</p>
              <p className={`text-xs ${theme.sidebarFooterText}`}>{user.email}</p>
            </div>
            <LogoutButton className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b ${theme.header} px-4 shadow-sm`}>
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`rounded-md p-2 text-gray-500 ${theme.headerHover} lg:hidden`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className={`ml-2 text-lg font-semibold ${theme.header.split(' ')[2]} lg:hidden`}>
              Employee Portal
            </span>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Dropdown>
                <Dropdown.Trigger>
                  <button className={`flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:${theme.dropdownFocus} focus:ring-offset-2`}>
                    <span className="sr-only">User menu</span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.dropdownIconBg}`}>
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <span className={`ml-2 hidden text-sm font-medium ${theme.header.split(' ')[2]} sm:inline`}>
                      {user.username}
                    </span>
                  </button>
                </Dropdown.Trigger>
             <Dropdown.Content>
  <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
  {/* Remove this line: */}
  {/* <Dropdown.Link href={route('theme.select')}>Theme</Dropdown.Link> */}
  <LogoutButton className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
    Log Out
  </LogoutButton>
</Dropdown.Content>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
