import { Head, Link } from '@inertiajs/react';
import { formatDate, formatTime } from '@/utils/date';
import HRLayout from '@/Layouts/HRLayout';
import {
  Users,
  Layers,
  GitBranch,
  CalendarDays,
  CalendarCheck,
  UserCheck,
  Clock,
  Activity,
  ArrowRight,
  Sparkles,
  PlusCircle,
  QrCode,
  FileSpreadsheet,
  UserPlus,
  BarChart3,
  Building2,
  ListChecks,
} from 'lucide-react';

export default function Dashboard({ auth, summary, todayOverview, upcomingEvents, recentActivity }) {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = formatDate(new Date());
  const currentTime = formatTime(new Date());

  const formatEventTime = (date, time) => {
  if (!date || !time) return '—';
  return formatTime(`${date}T${time}`);
};

  return (
    <HRLayout user={auth.user}>
      <Head title="HR Dashboard" />

      <div className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {getGreeting()}, {auth.user.username}!
                  </h1>
                </div>
                <p className="mt-1 text-sm text-navy-200">
                  Welcome back! Here's a summary of today's attendance activities and system updates.
                </p>
              </div>
              <div className="flex flex-col items-end text-sm">
                <span className="text-navy-200">{currentDate}</span>
                <span className="text-navy-100 font-medium">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Employees</dt>
              <dd className="text-xl font-bold text-navy-800">{summary.total_employees}</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Clusters</dt>
              <dd className="text-xl font-bold text-navy-800">{summary.total_clusters}</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Departments</dt>
              <dd className="text-xl font-bold text-navy-800">{summary.total_departments}</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Total Events</dt>
              <dd className="text-xl font-bold text-navy-800">{summary.total_events}</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Active Events</dt>
              <dd className="text-xl font-bold text-navy-800">{summary.active_events}</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Today's Attendance</dt>
              <dd className="text-xl font-bold text-navy-800">{summary.today_attendance}</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Total Records</dt>
              <dd className="text-xl font-bold text-navy-800">{summary.total_attendance_records}</dd>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Today's Overview */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-navy-800 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Overview
              </h2>
              <div className="mt-4 space-y-3">
                {todayOverview.ongoing_event ? (
  <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
    <CalendarCheck className="h-5 w-5 text-green-600 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-green-800">Ongoing Event</p>
      <p className="text-sm text-green-700">{todayOverview.ongoing_event.title}</p>
      <p className="text-xs text-green-600">
        {formatEventTime(todayOverview.ongoing_event.date, todayOverview.ongoing_event.time)}
      </p>
      {/* === NEW: Required Summary === */}
      <div className="mt-1 text-xs text-green-600">
        <p><strong>Attendance Mode:</strong> {todayOverview.ongoing_event.required_summary?.mode}</p>
        {todayOverview.ongoing_event.required_summary?.clusters && (
          <p><strong>Clusters:</strong> {todayOverview.ongoing_event.required_summary.clusters.join(', ')}</p>
        )}
        {todayOverview.ongoing_event.required_summary?.departments && (
          <p><strong>Departments:</strong> {todayOverview.ongoing_event.required_summary.departments.join(', ')}</p>
        )}
        {todayOverview.ongoing_event.required_summary?.total !== undefined && (
          <p><strong>Selected Employees:</strong> {todayOverview.ongoing_event.required_summary.total}</p>
        )}
      </div>
    </div>
  </div>
) : (
  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
    No ongoing event today.
  </div>
)}
                {todayOverview.upcoming_event ? (
                  <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                    <CalendarDays className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Upcoming Event</p>
                      <p className="text-sm text-blue-700">{todayOverview.upcoming_event.title}</p>
                      <p className="text-xs text-blue-600">
                       {formatEventTime(todayOverview.upcoming_event.date, todayOverview.upcoming_event.time)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                    No upcoming events scheduled.
                  </div>
                )}
                <div className="flex items-start gap-3 rounded-lg bg-navy-50 p-3">
                  <UserCheck className="h-5 w-5 text-navy-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-navy-800">Checked In Today</p>
                    <p className="text-sm text-navy-700">{todayOverview.employees_checked_in_today} employees</p>
                  </div>
                </div>
                {todayOverview.most_recent_attendance ? (
                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <Activity className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Latest Check‑In</p>
                      <p className="text-sm text-gray-600">
                        {todayOverview.most_recent_attendance.employee_name} – {todayOverview.most_recent_attendance.event_title}
                      </p>
                      <p className="text-xs text-gray-500">
                        at {formatTime(todayOverview.most_recent_attendance.time_in)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                    No check‑ins yet today.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-navy-800 flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Upcoming Events
              </h2>
              {upcomingEvents.length === 0 ? (
                <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                  <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2">No upcoming events.</p>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-gray-100">

  {upcomingEvents.map((event) => (
    <li key={event.id} className="py-3 first:pt-0 last:pb-0">
      <div className="flex justify-between">
        <div>
          <p className="font-medium text-navy-700">{event.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span>{formatDate(event.date)}</span>
            <span>at {formatEventTime(event.date, event.time)}</span>
            <span>• {event.venue}</span>
          </div>
        </div>
        <Link href={route('hr.events.edit', event.id)} className="text-sm text-navy-600 hover:text-navy-800">
          View
        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {upcomingEvents.length > 0 && (
                <div className="mt-4 text-right">
                  <Link
                    href={route('hr.events.index')}
                    className="inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-800"
                  >
                    View all events
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-navy-800">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Link
                href={route('hr.attendance.scan')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <QrCode className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Scan</span>
              </Link>
              <Link
                href={route('hr.events.create')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <PlusCircle className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Create Event</span>
              </Link>
              <Link
                href={route('hr.employees.import')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <FileSpreadsheet className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Import</span>
              </Link>
              <Link
                href={route('hr.employees.index')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <Users className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Employees</span>
              </Link>
              <Link
                href={route('hr.clusters.index')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <Layers className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Clusters</span>
              </Link>
              <Link
                href={route('hr.departments.index')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <GitBranch className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Departments</span>
              </Link>
              <Link
                href={route('hr.reports.index')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <BarChart3 className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Reports</span>
              </Link>
              <Link
                href={route('hr.analytics')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <ListChecks className="h-5 w-5 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Analytics</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                <Activity className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2">No recent activity.</p>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-gray-100">
                {recentActivity.map((activity, index) => {
                  let icon, text, color;
                  if (activity.type === 'event_created') {
                    icon = <CalendarDays className="h-4 w-4 text-blue-500" />;
                    text = `Event "${activity.title}" was created`;
                    color = 'text-blue-700';
                  } else if (activity.type === 'attendance_recorded') {
                    icon = <UserCheck className="h-4 w-4 text-green-500" />;
                    text = `${activity.employee_name} checked in for "${activity.event_title}"`;
                    color = 'text-green-700';
                  } else if (activity.type === 'employee_imported') {
                    icon = <UserPlus className="h-4 w-4 text-purple-500" />;
                    text = `Employee "${activity.full_name}" was imported`;
                    color = 'text-purple-700';
                  } else {
                    icon = <Activity className="h-4 w-4 text-gray-400" />;
                    text = 'Activity';
                    color = 'text-gray-700';
                  }
                  return (
                    <li key={index} className="flex items-center gap-3 py-2">
                      {icon}
                      <span className={`text-sm ${color}`}>{text}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        {formatTime(activity.created_at)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
