import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { formatDate, formatTime } from '@/utils/date';
import {
  Calendar, Clock, MapPin, Users, UserCheck, UserX,
  ArrowLeft, Download, Search, ListChecks
} from 'lucide-react';

export default function Required({ auth, event, required, summary, clusters, departments }) {
  const [clusterFilter, setClusterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) => !clusterFilter || dept.cluster_id == clusterFilter
    );
  }, [departments, clusterFilter]);

  const filteredList = useMemo(() => {
    let list = required;
    const selectedCluster = clusters.find(c => c.id == clusterFilter);
    if (selectedCluster) {
      list = list.filter((item) => item.cluster === selectedCluster.name);
    }
    if (departmentFilter) {
      const selectedDept = departments.find(d => d.id == departmentFilter);
      if (selectedDept) {
        list = list.filter((item) => item.department === selectedDept.name);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((item) =>
        item.employee_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [required, clusterFilter, departmentFilter, searchQuery, clusters, departments]);

  const exportCSV = () => {
    if (filteredList.length === 0) {
      toast.error('No data to export.');
      return;
    }
    const headers = ['Employee Name', 'Department', 'Cluster', 'Assignment Source', 'Status'];
    const rows = filteredList.map((item) => [
      item.employee_name,
      item.department,
      item.cluster,
      item.assignment_source || '',
      item.status === 'present' ? 'Present' : 'Pending',
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `required_${event.title}_${event.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <HRLayout user={auth.user}>
      <Head title={`Required - ${event.title}`} />

      <div className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
            <Link
              href={route('hr.events.index')}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-navy-800 sm:text-2xl lg:text-3xl">
                Required Attendees
              </h1>
              <p className="text-xs text-gray-500 sm:text-sm">
                {event.title} – Live monitoring
              </p>
            </div>
          </div>

          {/* Event Info */}
          <div className="overflow-hidden rounded-xl bg-white p-3 shadow-sm sm:p-4 md:p-6">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm sm:grid-cols-4 sm:gap-4">
              <div>
                <dt className="text-xs text-gray-500">Date</dt>
                <dd className="font-medium text-navy-700">
                  {formatDate(`${event.date}T${event.time}`)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Time</dt>
                <dd className="font-medium text-navy-700">
                  {formatTime(`${event.date}T${event.time}`)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Venue</dt>
                <dd className="font-medium text-navy-700">{event.venue}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Mode</dt>
                <dd className="font-medium text-navy-700">
                  {event.attendance_mode === 'all_employees' ? 'All Employees' :
                   event.attendance_mode === 'selected_clusters' ? 'Selected Clusters' :
                   event.attendance_mode === 'selected_departments' ? 'Selected Departments' :
                   'Selected Employees'}
                </dd>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-xl bg-navy-50 p-2 text-center sm:p-4">
              <dt className="text-xs text-navy-700">Required</dt>
              <dd className="text-lg font-bold text-navy-800 sm:text-2xl">
                {summary.total_required}
              </dd>
            </div>


          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-36 sm:w-40">
                <SelectInput
                  value={clusterFilter}
                  onChange={(e) => {
                    setClusterFilter(e.target.value);
                    setDepartmentFilter('');
                  }}
                  className="block w-full text-sm"
                >
                  <option value="">All Clusters</option>
                  {clusters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </SelectInput>
              </div>
              <div className="w-36 sm:w-40">
                <SelectInput
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="block w-full text-sm"
                >
                  <option value="">All Departments</option>
                  {filteredDepartments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </SelectInput>
              </div>
              <div className="relative flex-1 min-w-[140px] sm:min-w-[180px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <TextInput
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-8 text-sm shadow-sm focus:border-navy-500 focus:ring-navy-500"
                />
              </div>
              <button
                onClick={() => {
                  setClusterFilter('');
                  setDepartmentFilter('');
                  setSearchQuery('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <button
              onClick={exportCSV}
              className="inline-flex items-center rounded-md bg-navy-700 px-3 py-1.5 text-xs text-white hover:bg-navy-800 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              {filteredList.length === 0 ? (
                <div className="p-6 text-center text-gray-500 sm:p-8">
                  <Users className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm">No required attendees found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">Department</th>
                      <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-4 sm:py-3">Cluster</th>
                      <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-4 sm:py-3">Source</th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredList.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-3 text-sm font-medium text-navy-800 sm:px-4 sm:py-4">
                          {item.employee_name}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 sm:px-4 sm:py-4">
                          {item.department}
                        </td>
                        <td className="hidden px-3 py-3 text-sm text-gray-500 sm:table-cell sm:px-4 sm:py-4">
                          {item.cluster}
                        </td>
                        <td className="hidden px-3 py-3 text-sm text-gray-500 sm:table-cell sm:px-4 sm:py-4">
                          {item.assignment_source || '—'}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
