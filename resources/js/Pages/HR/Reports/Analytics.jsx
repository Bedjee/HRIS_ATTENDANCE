import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { formatDate, formatTime } from '@/utils/date';
import {
  Bar,
  Doughnut,
  Line,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function Analytics({ auth, summary, clusterData, departmentData, monthlyTrend, topEvents, leastEvents, topEmployees, inactiveEmployees, clusters, departments, events, filters }) {
  const [clusterFilter, setClusterFilter] = useState(filters.cluster_id || '');
  const [departmentFilter, setDepartmentFilter] = useState(filters.department_id || '');
  const [eventFilter, setEventFilter] = useState(filters.event_id || '');
  const [yearFilter, setYearFilter] = useState(filters.year || new Date().getFullYear());

  const applyFilters = () => {
    router.get(route('hr.analytics'), {
      cluster_id: clusterFilter,
      department_id: departmentFilter,
      event_id: eventFilter,
      year: yearFilter,
    });
  };

  const clearFilters = () => {
    setClusterFilter('');
    setDepartmentFilter('');
    setEventFilter('');
    setYearFilter(new Date().getFullYear());
    router.get(route('hr.analytics'));
  };

  // Filter departments by cluster for dropdown
  const filteredDepartments = departments.filter(
    (dept) => !clusterFilter || dept.cluster_id == clusterFilter
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Analytics" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Analytics</h1>
              <p className="text-sm text-gray-500">Attendance insights and reports</p>
            </div>
          </div>

          {/* Filters */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="w-48">
                  <InputLabel htmlFor="cluster" value="Cluster" />
                  <SelectInput
                    id="cluster"
                    value={clusterFilter}
                    onChange={(e) => {
                      setClusterFilter(e.target.value);
                      setDepartmentFilter('');
                    }}
                    className="mt-1 block w-full"
                  >
                    <option value="">All Clusters</option>
                    {clusters.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
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
                    {filteredDepartments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </SelectInput>
                </div>
                <div className="w-48">
                  <InputLabel htmlFor="event" value="Event" />
                  <SelectInput
                    id="event"
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="mt-1 block w-full"
                  >
                    <option value="">All Events</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </SelectInput>
                </div>
                <div className="w-48">
                  <InputLabel htmlFor="year" value="Year" />
                  <SelectInput
                    id="year"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="mt-1 block w-full"
                  >
                    {[...Array(5)].map((_, i) => {
                      const y = new Date().getFullYear() - i;
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </SelectInput>
                </div>
                <PrimaryButton onClick={applyFilters} className="px-6">
                  Apply
                </PrimaryButton>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl bg-white p-4 shadow-sm text-center">
              <p className="text-sm text-gray-500">Events</p>
              <p className="text-xl font-bold text-navy-800">{summary.total_events}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm text-center">
              <p className="text-sm text-gray-500">Employees</p>
              <p className="text-xl font-bold text-navy-800">{summary.total_employees}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm text-center">
              <p className="text-sm text-gray-500">Attendances</p>
              <p className="text-xl font-bold text-navy-800">{summary.total_attendances}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm text-center">
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="text-xl font-bold text-navy-800">{summary.attendance_rate}%</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm text-center">
              <p className="text-sm text-gray-500">Clusters</p>
              <p className="text-xl font-bold text-navy-800">{summary.total_clusters}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm text-center">
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-xl font-bold text-navy-800">{summary.total_departments}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Attendance by Cluster (Doughnut) */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-center text-lg font-semibold text-navy-800">Attendance by Cluster</h3>
              <div className="h-64">
                <Doughnut data={clusterData} options={chartOptions} />
              </div>
            </div>

            {/* Attendance by Department (Bar) */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-center text-lg font-semibold text-navy-800">Attendance by Department</h3>
              <div className="h-64">
                <Bar data={departmentData} options={chartOptions} />
              </div>
            </div>

            {/* Monthly Trend (Line) */}
            <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
              <h3 className="mb-4 text-center text-lg font-semibold text-navy-800">Monthly Attendance Trend</h3>
              <div className="h-64">
                <Line data={monthlyTrend} options={lineOptions} />
              </div>
            </div>
          </div>

          {/* Top & Least Events */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-navy-800">Most Attended Events</h3>
              {topEvents.length === 0 ? (
                <p className="mt-2 text-gray-500">No events yet.</p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100">
                  {topEvents.map((event) => (
                    <li key={event.id} className="flex justify-between py-2">
                      <span className="text-sm text-gray-700">{event.title}</span>
                      <span className="text-sm font-medium text-navy-700">{event.attendances_count} attendees</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-navy-800">Least Attended Events</h3>
              {leastEvents.length === 0 ? (
                <p className="mt-2 text-gray-500">No events yet.</p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100">
                  {leastEvents.map((event) => (
                    <li key={event.id} className="flex justify-between py-2">
                      <span className="text-sm text-gray-700">{event.title}</span>
                      <span className="text-sm font-medium text-gray-500">{event.attendances_count} attendees</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Top Employees & Inactive */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-navy-800">Most Active Employees</h3>
              {topEmployees.length === 0 ? (
                <p className="mt-2 text-gray-500">No data.</p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100">
                  {topEmployees.map((emp) => (
                    <li key={emp.id} className="flex justify-between py-2">
                      <span className="text-sm text-gray-700">{emp.full_name}</span>
                      <span className="text-sm font-medium text-navy-700">{emp.attendances_count} attendances</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-navy-800">Employees with No Attendance</h3>
              {inactiveEmployees.length === 0 ? (
                <p className="mt-2 text-gray-500">All employees have attended at least one event.</p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {inactiveEmployees.map((emp) => (
                    <li key={emp.id} className="py-2">
                      <span className="text-sm text-gray-700">{emp.full_name}</span>
                      <span className="ml-2 text-xs text-gray-400">({emp.department?.name ?? 'Unassigned'})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
