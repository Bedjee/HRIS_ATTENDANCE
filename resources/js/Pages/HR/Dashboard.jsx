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
  Briefcase,
} from 'lucide-react';

/* ---------------------------------- */
/* Compact parol mark (Filipino star) */
/* ---------------------------------- */
function ParolMark({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="dashParolBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M50 6 L61.2 34.6 L91.9 36.4 L68.1 55.9 L75.9 85.6 L50 69 L24.1 85.6 L31.9 55.9 L8.1 36.4 L38.8 34.6 Z"
        fill="url(#dashParolBody)"
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
  const count = 22;
  const flags = Array.from({ length: count }).map((_, i) => {
    const t = i / (count - 1);
    return {
      color: palette[i % palette.length],
      sag: Math.sin(Math.PI * t) * 8,
      delay: `${(i % 7) * 0.25}s`,
    };
  });

  return (
    <div className={`pointer-events-none relative w-full ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-x-0 top-0 w-full h-4 text-amber-300/50"
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 1 Q 50 12 100 1"
          stroke="currentColor"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative flex justify-between items-start px-1 pt-1">
        {flags.map((f, i) => (
          <div
            key={i}
            className="w-1.5 h-2.5 sm:w-2 sm:h-3"
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

export default function Dashboard({ auth, summary, todayOverview, upcomingEvents, recentActivity }) {
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
          {/* ========== Welcome Section (Pasko banner) ========== */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1f2a] via-[#0d2a2f] to-[#2a1216] p-6 text-white shadow-lg ring-1 ring-amber-400/25 sm:p-8">
            {/* banderitas strip along the top */}
            <Banderitas className="absolute inset-x-0 top-0 h-4 sm:h-5" />

            {/* faint parol watermark */}
            <ParolMark className="pointer-events-none absolute -right-8 -bottom-10 h-40 w-40 opacity-[0.12] sm:opacity-20 sm:h-48 sm:w-48 animate-[hrParolSway_9s_ease-in-out_infinite]" />

            {/* warm glows */}
            <div className="pointer-events-none absolute -top-16 -left-12 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full bg-red-600/15 blur-3xl" />

            <div className="relative z-10 mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 font-serif text-sm italic text-amber-200/90">
                  Maligayang Pasko!
                </p>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {getGreeting()}, {auth.user.username}!
                  </h1>
                </div>
                <p className="mt-1 text-sm text-amber-100/75">
                  Welcome back! Here's a summary of today's attendance activities and system updates.
                </p>
              </div>
              <div className="flex flex-col items-end text-sm">
                <span className="text-amber-200/80">{currentDate}</span>
                <span className="font-medium text-amber-100">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* ========== Summary Cards ========== */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { label: 'Employees', value: summary.total_employees },
              { label: 'Clusters', value: summary.total_clusters },
              { label: 'Departments', value: summary.total_departments },
              { label: 'Total Events', value: summary.total_events },
              { label: 'Active Events', value: summary.active_events },
              { label: "Today's Attendance", value: summary.today_attendance },
              { label: 'Total Records', value: summary.total_attendance_records },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:shadow-md hover:ring-amber-300/70"
              >
                <dt className="text-sm font-medium text-gray-500">{card.label}</dt>
                <dd className="text-xl font-bold text-navy-800">{card.value}</dd>
              </div>
            ))}

            {/* Job Order employees card (warm accent) */}
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-amber-300/40 transition-all duration-300 hover:shadow-md hover:ring-amber-400/70">
              <dt className="flex items-center gap-1 text-sm font-medium text-gray-500">
                <Briefcase className="h-3.5 w-3.5 text-amber-600" />
                Job Order (JO)
              </dt>
              <dd className="text-xl font-bold text-amber-700">
                {summary.total_job_order_employees ?? 0}
              </dd>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ========== Today's Overview ========== */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-navy-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200/70">
                  <Clock className="h-4 w-4" />
                </span>
                Today's Overview
              </h2>
              <div className="mt-4 space-y-3">
                {todayOverview.ongoing_event ? (
                  <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                    <CalendarCheck className="mt-0.5 h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Ongoing Event</p>
                      <p className="text-sm text-green-700">{todayOverview.ongoing_event.title}</p>
                      <p className="text-xs text-green-600">
                        {formatEventTime(
                          todayOverview.ongoing_event.date,
                          todayOverview.ongoing_event.time
                        )}
                      </p>
                      <div className="mt-1 text-xs text-green-600">
                        <p>
                          <strong>Attendance Mode:</strong>{' '}
                          {todayOverview.ongoing_event.required_summary?.mode}
                        </p>
                        {todayOverview.ongoing_event.required_summary?.clusters && (
                          <p>
                            <strong>Clusters:</strong>{' '}
                            {todayOverview.ongoing_event.required_summary.clusters.join(', ')}
                          </p>
                        )}
                        {todayOverview.ongoing_event.required_summary?.departments && (
                          <p>
                            <strong>Departments:</strong>{' '}
                            {todayOverview.ongoing_event.required_summary.departments.join(', ')}
                          </p>
                        )}
                        {todayOverview.ongoing_event.required_summary?.total !== undefined && (
                          <p>
                            <strong>Selected Employees:</strong>{' '}
                            {todayOverview.ongoing_event.required_summary.total}
                          </p>
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
                    <CalendarDays className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Upcoming Event</p>
                      <p className="text-sm text-blue-700">
                        {todayOverview.upcoming_event.title}
                      </p>
                      <p className="text-xs text-blue-600">
                        {formatEventTime(
                          todayOverview.upcoming_event.date,
                          todayOverview.upcoming_event.time
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                    No upcoming events scheduled.
                  </div>
                )}

                {/* Checked-in-today — warm festive accent since it's a positive stat */}
                <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200/60">
                  <UserCheck className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Checked In Today</p>
                    <p className="text-sm text-amber-800">
                      {todayOverview.employees_checked_in_today} employees
                    </p>
                  </div>
                </div>

                {todayOverview.most_recent_attendance ? (
                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <Activity className="mt-0.5 h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Latest Check‑In</p>
                      <p className="text-sm text-gray-600">
                        {todayOverview.most_recent_attendance.employee_name} –{' '}
                        {todayOverview.most_recent_attendance.event_title}
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

            {/* ========== Upcoming Events ========== */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-navy-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200/70">
                  <CalendarDays className="h-4 w-4" />
                </span>
                Upcoming Events
              </h2>
              {upcomingEvents.length === 0 ? (
                <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                  <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2">No upcoming events.</p>
                  <p className="mt-1 font-serif text-xs italic text-amber-600/70">
                    Enjoy the season 🎄
                  </p>
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
                        <Link
                          href={route('hr.events.edit', event.id)}
                          className="text-sm text-navy-600 transition-colors hover:text-amber-700"
                        >
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
                    className="inline-flex items-center text-sm font-medium text-navy-600 transition-colors hover:text-amber-700"
                  >
                    View all events
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ========== Quick Actions ========== */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-navy-800">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { to: 'hr.attendance.scan', Icon: QrCode, label: 'Scan' },
                { to: 'hr.events.create', Icon: PlusCircle, label: 'Create Event' },
                { to: 'hr.employees.import', Icon: FileSpreadsheet, label: 'Import' },
                { to: 'hr.employees.index', Icon: Users, label: 'Employees' },
                { to: 'hr.clusters.index', Icon: Layers, label: 'Clusters' },
                { to: 'hr.departments.index', Icon: GitBranch, label: 'Departments' },
                { to: 'hr.reports.index', Icon: BarChart3, label: 'Reports' },
                { to: 'hr.analytics', Icon: ListChecks, label: 'Analytics' },
              ].map(({ to, Icon, label }) => (
                <Link
                  key={to}
                  href={route(to)}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:bg-amber-50/50 hover:shadow-md hover:ring-amber-300/70"
                >
                  <Icon className="h-5 w-5 text-navy-600 transition-colors group-hover:text-amber-600" />
                  <span className="text-sm font-medium text-navy-700 transition-colors group-hover:text-amber-700">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ========== Recent Activity ========== */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-navy-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200/70">
                <Activity className="h-4 w-4" />
              </span>
              Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                <Activity className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2">No recent activity.</p>
                <p className="mt-1 font-serif text-xs italic text-amber-600/70">
                  Quiet so far — enjoy the Pasko season.
                </p>
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

      {/* ========== Animations ========== */}
      <style>{`
        @keyframes hrParolSway {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          50%      { transform: rotate(3deg) translateY(-6px); }
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
    </HRLayout>
  );
}