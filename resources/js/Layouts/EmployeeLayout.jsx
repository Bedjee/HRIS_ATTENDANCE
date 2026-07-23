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

export default function EmployeeLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { name: 'Dashboard', route: 'employee.dashboard', icon: LayoutDashboard },
    { name: 'My QR Code', route: 'employee.qr', icon: QrCode },
    { name: 'My Attendance', route: 'employee.attendance', icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-navy-800 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-navy-700 px-4">
          <Link href="/" className="flex items-center">
            <ApplicationLogo className="h-8 w-auto fill-current text-white" />
            <span className="ml-2 text-lg font-semibold text-white">Employee Portal</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 text-navy-300 hover:bg-navy-700 hover:text-white lg:hidden"
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
                className={`
                  flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-300 hover:bg-navy-700 hover:text-white'
                  }
                `}
                onClick={closeSidebar}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-navy-700 p-4">
  <div className="flex items-center">
    <div className="flex-1">
      <p className="text-sm font-medium text-white">{user.username}</p>
      <p className="text-xs text-navy-300">{user.email}</p>
    </div>
    <LogoutButton className="rounded-md p-2 text-navy-300 hover:bg-navy-700 hover:text-white" />
  </div>
</div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header – updated to lighter navy */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-200 bg-navy-50 px-4 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 text-gray-500 hover:bg-navy-100 hover:text-navy-700 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-2 text-lg font-semibold text-navy-800 lg:hidden">Employee Portal</span>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Dropdown>
                <Dropdown.Trigger>
                  <button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2">
                    <span className="sr-only">User menu</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-navy-700">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <span className="ml-2 hidden text-sm font-medium text-navy-700 sm:inline">
                      {user.username}
                    </span>
                  </button>
                </Dropdown.Trigger>
                 <Dropdown.Content>
      <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
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
