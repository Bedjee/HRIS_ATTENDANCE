import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import { formatDate, formatTime } from '@/utils/date';
import PrimaryButton from '@/Components/PrimaryButton';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FileText } from 'lucide-react';
import SummaryPDFModal from '@/Components/SummaryPDFModal';

export default function EventAttendance({ auth, events, clusters, departments }) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const filteredDepartments = departments.filter(
    (dept) => !clusterFilter || dept.cluster_id == clusterFilter
  );

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
    setAttendanceData(null);
  };

  const fetchAttendance = async () => {
    if (!selectedEventId) {
      toast.error('Please select an event.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(route('hr.reports.get-attendance'), {
        params: {
          event_id: selectedEventId,
          cluster_id: clusterFilter || undefined,
          department_id: departmentFilter || undefined,
        },
      });
      setAttendanceData(response.data);
    } catch (error) {
      toast.error('Failed to load attendance data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!selectedEventId) {
      toast.error('Please select an event.');
      return;
    }

    setExporting(true);
    try {
      const params = new URLSearchParams({
        event_id: selectedEventId,
        format: format,
      });
      if (clusterFilter) params.append('cluster_id', clusterFilter);
      if (departmentFilter) params.append('department_id', departmentFilter);

      const url = route('hr.reports.export') + '?' + params.toString();
      window.location.href = url;
      toast.success(`Exporting as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    setDepartmentFilter('');
  }, [clusterFilter]);

  const eventDateTime = attendanceData?.event
    ? `${attendanceData.event.date}T${attendanceData.event.time}`
    : null;

  return (
    <HRLayout user={auth.user}>
      <Head title="Attendance Reports" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-navy-800">Attendance Reports</h2>
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="inline-flex items-center rounded-md bg-navy-700 px-4 py-2 text-sm text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Summary PDF
                </button>
              </div>

              {/* Filters */}
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <div className="w-64">
                  <InputLabel htmlFor="event" value="Select Event" />
                  <SelectInput
                    id="event"
                    value={selectedEventId}
                    onChange={handleEventChange}
                    className="mt-1 block w-full"
                  >
                    <option value="">-- Select Event --</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} - {event.date}
                      </option>
                    ))}
                  </SelectInput>
                </div>

                <div className="w-48">
                  <InputLabel htmlFor="cluster" value="Cluster" />
                  <SelectInput
                    id="cluster"
                    value={clusterFilter}
                    onChange={(e) => setClusterFilter(e.target.value)}
                    className="mt-1 block w-full"
                  >
                    <option value="">All Clusters</option>
                    {clusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        {cluster.name}
                      </option>
                    ))}
                  </SelectInput>
                </div>

                <div className="w-48">
                  <InputLabel htmlFor="department" value="Department" />
                  <SelectInput
                    id="department"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="mt-1 block w-full"
                  >
                    <option value="">All Departments</option>
                    {filteredDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </SelectInput>
                </div>

                <PrimaryButton onClick={fetchAttendance} disabled={loading}>
                  {loading ? 'Loading...' : 'View Attendance'}
                </PrimaryButton>

                {(clusterFilter || departmentFilter) && (
                  <button
                    onClick={() => {
                      setClusterFilter('');
                      setDepartmentFilter('');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Attendance Table */}
              {attendanceData && (
                <div className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-navy-800">
                      {attendanceData.event.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {eventDateTime ? `${formatDate(eventDateTime)} at ${formatTime(eventDateTime)}` : '—'} - {attendanceData.event.venue}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Employees: {attendanceData.attendances.length}
                    </p>
                    {(clusterFilter || departmentFilter) && (
                      <p className="text-sm text-gray-500">
                        Filtered by: {clusterFilter ? `Cluster: ${clusters.find(c => c.id == clusterFilter)?.name}` : ''}
                        {clusterFilter && departmentFilter ? ' & ' : ''}
                        {departmentFilter ? `Department: ${departments.find(d => d.id == departmentFilter)?.name}` : ''}
                      </p>
                    )}
                  </div>

                  {attendanceData.attendances.length === 0 ? (
                    <p className="text-gray-500">No employees found for this event with the selected filters.</p>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Employee Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Department
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Cluster
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Time In
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {attendanceData.attendances.map((record, index) => {
                              const status = record.status || 'absent';
                              const badgeColor =
                                status === 'present'
                                  ? 'bg-green-100 text-green-800'
                                  : status === 'late'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800';
                              return (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.employee_name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.department}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.cluster}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.time_in ? formatTime(record.time_in) : '—'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badgeColor}`}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <PrimaryButton
                          onClick={() => handleExport('csv')}
                          disabled={exporting}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Export CSV
                        </PrimaryButton>
                        <PrimaryButton
                          onClick={() => handleExport('xlsx')}
                          disabled={exporting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Export Excel
                        </PrimaryButton>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SummaryPDFModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        events={events}
        clusters={clusters}
        departments={departments}
      />
    </HRLayout>
  );
}
