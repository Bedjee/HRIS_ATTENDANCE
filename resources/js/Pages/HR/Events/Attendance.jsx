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
  AlertCircle,
  ArrowLeft,
  Download,
  Search,
  UserPlus,
  Pencil,
} from 'lucide-react';

export default function Attendance({
  auth,
  event,
  summary,
  present,
  absent,
  late,
  clusters,
  departments,
  isPast,
  requiredEmployees,
}) {
  const [activeTab, setActiveTab] = useState('present');
  const [clusterFilter, setClusterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual attendance modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [empSearch, setEmpSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [saving, setSaving] = useState(false);

  // Status edit modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [editReason, setEditReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter departments by cluster
  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) => !clusterFilter || dept.cluster_id == clusterFilter
    );
  }, [departments, clusterFilter]);

  // Current list based on active tab
  const currentList = activeTab === 'present' ? present : activeTab === 'late' ? late : absent;

  // Apply filters and search
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

  // Helper to get attendance mode label
  const getModeLabel = (mode) => {
    switch (mode) {
      case 'all_employees': return 'All Employees';
      case 'selected_clusters': return 'Selected Clusters';
      case 'selected_departments': return 'Selected Departments';
      case 'selected_employees': return 'Selected Employees';
      default: return mode;
    }
  };

  // Filter employees for manual attendance
  const filteredEmployees = useMemo(() => {
    if (!empSearch.trim()) return requiredEmployees || [];
    const q = empSearch.trim().toLowerCase();
    return (requiredEmployees || []).filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    );
  }, [requiredEmployees, empSearch]);

  // Export helpers
  const exportCSV = (list, filename) => {
    if (list.length === 0) {
      toast.error('No data to export.');
      return;
    }
    const headers = ['Employee Name', 'Department', 'Cluster', 'Check-In Time', 'Status'];
    const rows = list.map((item) => [
      item.employee_name,
      item.department,
      item.cluster,
      item.time_in ? formatTime(item.time_in) : '',
      item.status === 'late' ? 'Late' : activeTab === 'absent' ? 'Absent' : 'Present',
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

  const exportLate = () => {
    const data = activeTab === 'late' ? filteredList : late;
    exportCSV(data, `late_${event.title}_${event.date}.csv`);
  };

  const exportAbsent = () => {
    const data = activeTab === 'absent' ? filteredList : absent;
    exportCSV(data, `absent_${event.title}_${event.date}.csv`);
  };

  const exportAll = () => {
    const combined = [...present, ...late, ...absent];
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
        time_in: manualTime || null,
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

  // Open status edit modal
  const openStatusModal = (item) => {
    setEditingAttendance(item);
    setNewStatus(item.status || 'present');
    setEditReason('');
    setShowStatusModal(true);
  };

  // Submit status change
  const handleStatusUpdate = async () => {
    if (!editingAttendance) return;
    if (!editReason.trim()) {
      toast.error('Please provide a reason for the status change.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        route('hr.attendance.update-status', editingAttendance.id),
        {
          status: newStatus,
          reason: editReason.trim(),
        }
      );

      if (response.data.success) {
        toast.success('Attendance status updated successfully.');
        setShowStatusModal(false);
        setEditingAttendance(null);
        router.reload();
      } else {
        toast.error(response.data.message || 'Failed to update status.');
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
      setIsSubmitting(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'Present';
      case 'late': return 'Late';
      case 'absent': return 'Absent';
      default: return status || 'Unknown';
    }
  };

  // ========== RENDER ==========
  return (
    <HRLayout user={auth.user}>
      <Head title={`Attendance - ${event.title}`} />

      <div className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Back button & header */}
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
            <Link
              href={route('hr.events.index')}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-navy-800 sm:text-2xl lg:text-3xl">
                {event.title}
              </h1>
              <p className="text-xs text-gray-500 sm:text-sm">Attendance Details</p>
            </div>
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
                <dt className="text-xs text-gray-500">Grace Period</dt>
                <dd className="font-medium text-navy-700">
                  {event.grace_period ? `${event.grace_period} min` : '—'}
                </dd>
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
          <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4">
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
            <div className="rounded-xl bg-yellow-50 p-2 text-center sm:p-4">
              <dt className="text-xs text-yellow-700">Late</dt>
              <dd className="text-lg font-bold text-yellow-800 sm:text-2xl">
                {summary.total_late}
              </dd>
            </div>
            <div className="rounded-xl bg-red-50 p-2 text-center sm:p-4">
              <dt className="text-xs text-red-700">Absent</dt>
              <dd className="text-lg font-bold text-red-800 sm:text-2xl">
                {summary.total_absent}
              </dd>
            </div>
          </div>

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
                onClick={() => setActiveTab('late')}
                className={`px-3 py-1 text-sm font-medium ${
                  activeTab === 'late'
                    ? 'border-b-2 border-navy-700 text-navy-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Late ({late.length})
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
              <div className="w-full sm:w-36">
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
              <div className="w-full sm:w-36">
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
              <div className="relative flex-1 min-w-[140px] w-full sm:w-auto">
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
                className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>

          {/* ====== MOBILE CARD LAYOUT ====== */}
          <div className="mt-4 space-y-3 sm:hidden">
            {filteredList.length === 0 ? (
              <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
                <Users className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm">No {activeTab} employees found.</p>
              </div>
            ) : (
              filteredList.map((item) => (
                <div
                  key={item.id || item.employee_id}
                  className="rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-navy-800">{item.employee_name}</p>
                      <p className="text-sm text-gray-500">{item.department}</p>
                      <p className="text-xs text-gray-400">{item.cluster}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(item.status)}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                      {item.id && (
                        <button
                          onClick={() => openStatusModal(item)}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy-600 transition-colors"
                          title="Edit attendance status"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {(activeTab === 'present' || activeTab === 'late') && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Check‑in: {formatTime(item.time_in)}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ====== DESKTOP TABLE LAYOUT ====== */}
          <div className="mt-4 hidden overflow-hidden rounded-xl bg-white shadow-sm sm:block">
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
                      <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell md:px-4 md:py-3">
                        Cluster
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">
                        {activeTab === 'present' || activeTab === 'late' ? 'Check‑In' : 'Status'}
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">
                        Status
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredList.map((item) => (
                      <tr key={item.id || item.employee_id}>
                        <td className="px-3 py-3 text-sm font-medium text-navy-800 sm:px-4 sm:py-4">
                          {item.employee_name}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 sm:px-4 sm:py-4">
                          {item.department}
                        </td>
                        <td className="hidden px-3 py-3 text-sm text-gray-500 md:table-cell md:px-4 md:py-4">
                          {item.cluster}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 sm:px-4 sm:py-4">
                          {activeTab === 'present' || activeTab === 'late'
                            ? formatTime(item.time_in)
                            : '—'}
                        </td>
                        <td className="px-3 py-3 text-sm sm:px-4 sm:py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(item.status)}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                          {item.id ? (
                            <button
                              onClick={() => openStatusModal(item)}
                              className="inline-flex items-center rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-navy-600 transition-colors"
                              title="Edit attendance status"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Export & Manual Attendance Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={exportPresent}
              className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-xs text-white hover:bg-green-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              Present
            </button>
            <button
              onClick={exportLate}
              className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-xs text-white hover:bg-yellow-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              Late
            </button>
            <button
              onClick={exportAbsent}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              Absent
            </button>
            <button
              onClick={exportAll}
              className="inline-flex items-center rounded-md bg-navy-700 px-3 py-2 text-xs text-white hover:bg-navy-800 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Download className="mr-1 h-4 w-4" />
              All
            </button>
            <button
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <UserPlus className="mr-1 h-4 w-4" />
              Manual
            </button>
          </div>
        </div>
      </div>

      {/* ----- MODALS ----- */}
      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-navy-800">Manual Attendance</h3>
            <p className="mt-1 text-sm text-gray-500">
              Record attendance for an employee without scanning.
            </p>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Search Employee</label>
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

            {selectedEmployee && (
              <div className="mt-3 rounded-md bg-gray-50 p-3">
                <p className="text-sm font-medium text-navy-800">{selectedEmployee.name}</p>
                <p className="text-xs text-gray-500">
                  {selectedEmployee.department} · {selectedEmployee.cluster}
                </p>
              </div>
            )}

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

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Check‑In Time</label>
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
                {saving ? 'Saving...' : 'Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Edit Modal */}
      {showStatusModal && editingAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-navy-800">Edit Attendance Status</h3>
            <p className="mt-1 text-sm text-gray-500">
              Update the attendance status for {editingAttendance.employee_name}.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Current Status</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(editingAttendance.status)}`}
                  >
                    {getStatusLabel(editingAttendance.status)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Check‑In Time</label>
                <p className="mt-1 text-sm text-gray-500">
                  {editingAttendance.time_in ? formatTime(editingAttendance.time_in) : '—'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Explain why the status is being changed..."
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setEditingAttendance(null);
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isSubmitting || !editReason.trim()}
                className="rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </HRLayout>
  );
}
