import { Head, Link } from '@inertiajs/react';
import { formatDate, formatTime } from '@/utils/date';
import { getTheme } from '@/utils/themes';
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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = formatDate(new Date());
  const currentTime = formatTime(new Date());

  const themeName = employee?.theme || 'navy';
  const t = getTheme(themeName);

  const formatEventTime = (date, time) => {
    if (!date || !time) return '—';
    return formatTime(`${date}T${time}`);
  };

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
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Welcome Section – now theme-aware */}
         <div className={`mb-6 rounded-xl ${t.bgSolid} p-4 text-white shadow-lg sm:p-6 lg:p-8`}>
  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
    <div>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-yellow-300 sm:h-5 sm:w-5" />
        <h1 className="text-lg font-bold sm:text-2xl lg:text-3xl">
          {getGreeting()}, {employee.formatted_name}!
        </h1>
      </div>
      <p className={`mt-0.5 text-xs ${t.textAccent} sm:text-sm`}>
        {employee.department} · {employee.cluster}
      </p>
    </div>
    <div className="flex flex-col items-start text-xs sm:items-end sm:text-sm">
      <span className={t.textAccent}>{currentDate}</span>
      <span className={`font-medium ${t.textLight}`}>{currentTime}</span>
    </div>
  </div>
</div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center">
                <div className={`mr-3 rounded-full ${t.bgCard} p-2 ${t.textCard}`}>
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">Events Attended</p>
                  <p className={`text-xl font-bold ${t.textHeading} sm:text-2xl`}>{stats.total_events}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center">
                <div className={`mr-3 rounded-full ${t.bgCard} p-2 ${t.textCard}`}>
                  <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">Upcoming Events</p>
                  <p className={`text-xl font-bold ${t.textHeading} sm:text-2xl`}>{stats.upcoming_events}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center">
                <div className={`mr-3 rounded-full ${t.bgCard} p-2 ${t.textCard}`}>
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">Attendance Rate</p>
                  <p className={`text-xl font-bold ${t.textHeading} sm:text-2xl`}>{stats.attendance_rate || '—'}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Profile */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <h3 className={`text-base font-semibold ${t.textHeading} sm:text-lg`}>Profile</h3>
              <div className="mt-3 space-y-1.5 text-sm">
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

            <div className="rounded-xl bg-white p-4 text-center shadow-sm sm:p-6">
              <h3 className={`text-base font-semibold ${t.textHeading} sm:text-lg`}>Your QR Code</h3>
              <div className="mt-3 flex justify-center">
                <img src={qrCodeData} alt="QR Code" className="h-32 w-32 sm:h-48 sm:w-48" />
              </div>
              <p className="mt-2 text-xs text-gray-500 sm:text-sm">Present this QR code to HR for attendance.</p>
              <button
                onClick={downloadQR}
                className={`mt-3 inline-flex items-center rounded-lg ${t.bgButton} px-3 py-1.5 text-sm text-white ${t.hoverButton} sm:px-4 sm:py-2`}
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR (PNG)
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <h3 className={`flex items-center gap-2 text-base font-semibold ${t.textHeading} sm:text-lg`}>
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <div className="mt-3 rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                <Calendar className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm">No upcoming events.</p>
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-gray-100">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className={`font-medium ${t.textHeading}`}>{event.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 sm:text-sm">
                        <span>{formatDate(event.date)}</span>
                        <span>at {formatEventTime(event.date, event.time)}</span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Attendance History */}
          <div className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-semibold ${t.textHeading} sm:text-lg`}>Recent Attendance</h3>
              <span className="text-xs text-gray-400">Last 10</span>
            </div>
            {attendanceHistory.length === 0 ? (
              <div className="mt-3 text-center text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">No attendance records yet.</p>
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                      <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Venue</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {attendanceHistory.map((record, index) => (
                      <tr key={index}>
                        <td className={`px-3 py-2.5 ${t.textHeading}`}>{record.event_title}</td>
                        <td className="px-3 py-2.5 text-gray-500">{formatDate(record.event_date)}</td>
                        <td className="hidden px-3 py-2.5 text-gray-500 sm:table-cell">{record.venue}</td>
                        <td className="px-3 py-2.5 text-gray-500">{formatTime(record.time_in)}</td>
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
