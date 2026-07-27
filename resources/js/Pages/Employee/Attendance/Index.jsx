import { Head, Link } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { formatDate, formatTime } from '@/utils/date';
import { getTheme } from '@/utils/themes';
import { Calendar, Clock, Award, History } from 'lucide-react';

export default function Index({ auth, attendances, summary }) {
  const safeSummary = summary || { total_events: 0, total_attendances: 0, most_recent: null };
  const data = attendances?.data || [];

  const themeName = auth.user?.theme || 'navy';
  const t = getTheme(themeName);

  return (
    <EmployeeLayout user={auth.user}>
      <Head title="My Attendance" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <History className={`h-8 w-8 ${t.icon}`} />
            <h1 className={`ml-3 text-2xl font-bold ${t.textHeading}`}>My Attendance</h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <Award className={`h-5 w-5 ${t.icon}`} />
                <span className="ml-2 text-sm text-gray-500">Total Events</span>
              </div>
              <p className={`mt-1 text-2xl font-bold ${t.textHeading}`}>{safeSummary.total_events || 0}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <Calendar className={`h-5 w-5 ${t.icon}`} />
                <span className="ml-2 text-sm text-gray-500">Total Attendance</span>
              </div>
              <p className={`mt-1 text-2xl font-bold ${t.textHeading}`}>{safeSummary.total_attendances || 0}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <Clock className={`h-5 w-5 ${t.icon}`} />
                <span className="ml-2 text-sm text-gray-500">Most Recent</span>
              </div>
              {safeSummary.most_recent ? (
                <div className="mt-1">
                  <p className={`text-sm font-medium ${t.textHeading}`}>{safeSummary.most_recent.event_title}</p>
                  <p className="text-xs text-gray-500">{formatTime(safeSummary.most_recent.time_in)}</p>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-500">—</p>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              {data.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <History className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No attendance records found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event Date</th>
                      <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Venue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Check-In</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((record) => (
                      <tr key={record.id}>
                        <td className={`px-4 py-4 text-sm font-medium ${t.textHeading}`}>{record.event_title}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{formatDate(record.event_date)}</td>
                        <td className="hidden px-4 py-4 text-sm text-gray-500 sm:table-cell">{record.venue}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{formatTime(record.time_in)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {attendances?.links && data.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {attendances.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${
                        link.active
                          ? t.activePagination
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      disabled={!link.url}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
