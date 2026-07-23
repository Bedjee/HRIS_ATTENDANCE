import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { formatDate, formatTime } from '@/utils/date';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  UserX,
  ArrowLeft,
  Download,
  Search,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';

export default function Attendance({
  auth,
  event,
  summary,
  present,
  absent,
  clusters,
  departments,
  isPast,
  requiredEmployees,
}) {
  const [activeTab, setActiveTab] = useState('present');
  const [clusterFilter, setClusterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual attendance state
  const [showManualModal, setShowManualModal] = useState(false);
  const [empSearch, setEmpSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [saving, setSaving] = useState(false);

  // Filter departments based on selected cluster
  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) => !clusterFilter || dept.cluster_id == clusterFilter
    );
  }, [departments, clusterFilter]);

  const currentList = activeTab === 'present' ? present : absent;

  const filteredList = useMemo(() => {
    let list = currentList;
    const selectedCluster = clusters.find((c) => c.id == clusterFilter);
    if (selectedCluster) {
      list = list.filter((item) => item.cluster === selectedCluster.name);
    }
    if (departmentFilter) {
      const selectedDept = departments.find((d) => d.id == departmentFilter);
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
  }, [currentList, clusterFilter, departmentFilter, searchQuery, clusters, departments]);

  // Manual attendance employee search
  const filteredEmployees = useMemo(() => {
    if (!empSearch.trim()) return requiredEmployees;
    const q = empSearch.trim().toLowerCase();
    return requiredEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    );
  }, [requiredEmployees, empSearch]);

  const getModeLabel = (mode) => {
    switch (mode) {
      case 'all_employees':
        return 'All Employees';
      case 'selected_clusters':
        return 'Selected Clusters';
      case 'selected_departments':
        return 'Selected Departments';
      case 'selected_employees':
        return 'Selected Employees';
      default:
        return mode;
    }
  };

  // Export helpers
  const exportCSV = (list, filename) => {
    if (list.length === 0) {
      toast.error('No data to export.');
      return;
    }
    const headers = ['Employee Name', 'Department', 'Cluster', 'Check-In Time'];
    const rows = list.map((item) => [
      item.employee_name,
      item.department,
      item.cluster,
      item.time_in ? formatTime(item.time_in) : '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPresent = () => {
    const data = activeTab === 'present' ? filteredList : present;
    exportCSV(data, `present_${event.title}_${event.date}.csv`);
  };

  const exportAbsent = () => {
    const data = activeTab === 'absent' ? filteredList : absent;
    exportCSV(data, `absent_${event.title}_${event.date}.csv`);
  };

  const exportAll = () => {
    const combined = [...present, ...absent];
    exportCSV(combined, `attendance_${event.title}_${event.date}.csv`);
  };

  // Manual attendance submit
  const handleManualSubmit = async () => {
  if (!selectedEmployee) {
    toast.error('Please select an employee.');
    return;
  }
  if (!remarks.trim()) {
    toast.error('Please provide remarks.');
    return;
  }

  setSaving(true);
  try {
    const payload = {
      employee_id: selectedEmployee.id,
      remarks: remarks.trim(),
      // Convert datetime-local value to Y-m-d H:i:s
      time_in: manualTime ? manualTime.replace('T', ' ') + ':00' : null,
    };
    const response = await axios.post(
      route('hr.events.manual-attendance', event.id),
      payload
    );
    if (response.data.success) {
      toast.success('Attendance recorded manually.');
      setShowManualModal(false);
      router.reload();
    } else {
      toast.error(response.data.message || 'Failed to record attendance.');
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const errors = error.response.data.errors;
      const messages = Object.values(errors).flat().join(' ');
      toast.error(messages);
    } else {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
  } finally {
    setSaving(false);
  }
};



  return (
    <HRLayout user={auth.user}>
      <Head title={`Attendance - ${event.title}`} />

      <div className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Header with back button and manual attendance */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Link
                href={route('hr.events.index')}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-navy-800 sm:text-2xl lg:text-3xl">
                  Attendance Results
                </h1>
                <p className="text-xs text-gray-500 sm:text-sm">
                  {event.title} – Final outcome
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center rounded-md bg-navy-700 px-3 py-1.5 text-sm text-white hover:bg-navy-800 sm:px-4 sm:py-2"
            >
              <UserPlus className="mr-1 h-4 w-4" />
              Manual Attendance
            </button>
          </div>

          {/* Event Info Card */}
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
                  {getModeLabel(event.attendance_mode)}
                </dd>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-xl bg-navy-50 p-2 text-center sm:p-4">
              <dt className="text-xs text-navy-700">Required</dt>
              <dd className="text-lg font-bold text-navy-800 sm:text-2xl">
                {summary.total_required}
              </dd>
            </div>
            <div className="rounded-xl bg-green-50 p-2 text-center sm:p-4">
              <dt className="text-xs text-green-700">Present</dt>
              <dd className="text-lg font-bold text-green-800 sm:text-2xl">
                {summary.total_present}
              </dd>
            </div>
            <div className="rounded-xl bg-red-50 p-2 text-center sm:p-4">
              <dt className="text-xs text-red-700">Absent</dt>
              <dd className="text-lg font-bold text-red-800 sm:text-2xl">
                {summary.total_absent}
              </dd>
            </div>
          </div>

          {/* If event not yet ended, show a message */}
          {!isPast && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-yellow-50 p-3 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">
                This event is still ongoing. The <strong>Absent</strong> list will be available after the event ends.
              </p>
            </div>
          )}

          {/* Tabs + Filters */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex gap-2 border-b border-gray-200 pb-2 sm:border-b-0 sm:pb-0">
              <button
                onClick={() => setActiveTab('present')}
                className={`px-3 py-1 text-sm font-medium ${
                  activeTab === 'present'
                    ? 'border-b-2 border-navy-700 text-navy-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Present ({present.length})
              </button>
              <button
                onClick={() => setActiveTab('absent')}
                className={`px-3 py-1 text-sm font-medium ${
                  activeTab === 'absent'
                    ? 'border-b-2 border-navy-700 text-navy-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Absent ({absent.length})
              </button>
            </div>
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
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
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
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
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
          </div>

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              {filteredList.length === 0 ? (
                <div className="p-6 text-center text-gray-500 sm:p-8">
                  <Users className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm">No {activeTab} employees found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">
                        Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">
                        Department
                      </th>
                      <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-4 sm:py-3">
                        Cluster
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">
                        {activeTab === 'present' ? 'Check‑In' : 'Status'}
                      </th>
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
                        <td className="px-3 py-3 text-sm text-gray-500 sm:px-4 sm:py-4">
                          {activeTab === 'present' ? (
                            item.time_in ? formatTime(item.time_in) : '—'
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                              Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Export buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={exportPresent}
              className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              Export Present
            </button>
            <button
              onClick={exportAbsent}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              Export Absent
            </button>
            <button
              onClick={exportAll}
              className="inline-flex items-center rounded-md bg-navy-700 px-3 py-1.5 text-xs text-white hover:bg-navy-800 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              Export All
            </button>
          </div>

          {/* Manual Attendance Modal */}
          {showManualModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-navy-800">Manual Attendance</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Record attendance for an employee without scanning.
                </p>

                {/* Employee Search */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Search Employee
                  </label>
                  <input
                    type="text"
                    value={empSearch}
                    onChange={(e) => {
                      setEmpSearch(e.target.value);
                      if (selectedEmployee) setSelectedEmployee(null);
                    }}
                    placeholder="Type employee name..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                  />
                </div>

                {/* Employee list results */}
                {empSearch && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded border border-gray-200">
                    {filteredEmployees.length === 0 ? (
                      <p className="p-2 text-sm text-gray-500">No employees found.</p>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setEmpSearch('');
                          }}
                          className={`cursor-pointer border-b p-2 hover:bg-gray-50 ${
                            selectedEmployee?.id === emp.id ? 'bg-navy-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-navy-800">{emp.name}</p>
                          <p className="text-xs text-gray-500">
                            {emp.department} · {emp.cluster}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Selected Employee Display */}
                {selectedEmployee && (
                  <div className="mt-3 rounded-md bg-gray-50 p-3">
                    <p className="text-sm font-medium text-navy-800">{selectedEmployee.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedEmployee.department} · {selectedEmployee.cluster}
                    </p>
                  </div>
                )}

                {/* Remarks */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Remarks <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                  >
                    <option value="">Select a reason...</option>
                    <option value="QR Code Damaged">QR Code Damaged</option>
                    <option value="QR Code Not Readable">QR Code Not Readable</option>
                    <option value="Scanner Issue">Scanner Issue</option>
                    <option value="Device Problem">Device Problem</option>
                    <option value="Administrative Approval">Administrative Approval</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Optional Time Override */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Check‑In Time
                  </label>
                  <input
                    type="datetime-local"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Leave blank to use current server time.
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowManualModal(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleManualSubmit}
                    disabled={saving || !selectedEmployee || !remarks}
                    className="rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Record Attendance'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </HRLayout>
  );
}
