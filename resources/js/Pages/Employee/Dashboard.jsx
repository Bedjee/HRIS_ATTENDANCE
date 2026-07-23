import { Head, Link } from '@inertiajs/react';
import { formatDate, formatTime } from '@/utils/date';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import {
  Calendar,
  Award,
  Clock,
  Download,
  User,
  Building2,
  Layers,
  Sparkles,
  CalendarDays,
  MapPin,
} from 'lucide-react';

export default function Dashboard({ auth, employee, stats, attendanceHistory, qrCodeData, upcomingEvents }) {
  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = formatDate(new Date());
  const currentTime = formatTime(new Date());

  // Helper to format event time from date+time
  const formatEventTime = (date, time) => {
    if (!date || !time) return '—';
    return formatTime(`${date}T${time}`);
  };

  // Download QR as PNG
  const downloadQR = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `qr-${employee.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.crossOrigin = 'anonymous';
    img.src = qrCodeData;
  };

  return (
    <EmployeeLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {getGreeting()}, {employee.formatted_name}!
                  </h1>
                </div>
                <p className="mt-1 text-sm text-navy-200">
                  {employee.department} · {employee.cluster}
                </p>
              </div>
              <div className="flex flex-col items-end text-sm">
                <span className="text-navy-200">{currentDate}</span>
                <span className="text-navy-100 font-medium">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-navy-100 p-2 text-navy-700">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Events Attended</p>
                  <p className="text-2xl font-bold text-navy-800">{stats.total_events}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-navy-100 p-2 text-navy-700">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                  <p className="text-2xl font-bold text-navy-800">{stats.upcoming_events}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-navy-100 p-2 text-navy-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                  <p className="text-2xl font-bold text-navy-800">{stats.attendance_rate || '—'}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Profile Card */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Profile Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-navy-800">Profile</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-start">
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    <strong>Name:</strong> {employee.formatted_name}
                  </span>
                </div>
                <div className="flex items-start">
                  <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    <strong>Department:</strong> {employee.department}
                  </span>
                </div>
                <div className="flex items-start">
                  <Layers className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    <strong>Cluster:</strong> {employee.cluster}
                  </span>
                </div>
                <div className="flex items-start">
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    <strong>Username:</strong> {employee.username}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-navy-800">Your QR Code</h3>
              <div className="mt-4 flex justify-center">
                <img src={qrCodeData} alt="QR Code" className="h-48 w-48" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Present this QR code to HR for attendance.</p>
              <button
                onClick={downloadQR}
                className="mt-4 inline-flex items-center rounded-lg bg-navy-700 px-4 py-2 text-sm text-white hover:bg-navy-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR (PNG)
              </button>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-navy-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                <Calendar className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2">No upcoming events.</p>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-gray-100">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-navy-700">{event.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span>{formatDate(event.date)}</span>
                          <span>at {formatEventTime(event.date, event.time)}</span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.venue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Attendance History */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy-800">Recent Attendance</h3>
              <span className="text-xs text-gray-400">Last 10 records</span>
            </div>
            {attendanceHistory.length === 0 ? (
              <div className="mt-4 text-center text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">No attendance records yet.</p>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Event
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">
                        Venue
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Time In
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {attendanceHistory.map((record, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-navy-700">{record.event_title}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(record.event_date)}</td>
                        <td className="hidden px-4 py-3 text-sm text-gray-500 sm:table-cell">{record.venue}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatTime(record.time_in)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
