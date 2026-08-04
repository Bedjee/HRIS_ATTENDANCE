import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
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
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  LineChart,
  Building2,
  Layers,
} from 'lucide-react';

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

// ─── Chart default options (modern, clean) ──────────────────────────
const getDefaultOptions = (type = 'bar') => {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, weight: '400' },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  };

  if (type === 'line') {
    return {
      ...base,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
          ticks: { font: { size: 10 }, color: '#94a3b8' },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 }, color: '#94a3b8' },
        },
      },
      elements: {
        line: { tension: 0.4, borderWidth: 2.5 },
        point: { radius: 2, hoverRadius: 5 },
      },
    };
  }

  if (type === 'doughnut') {
    return {
      ...base,
      cutout: '70%',
      plugins: {
        ...base.plugins,
        legend: {
          position: 'bottom',
          labels: { boxWidth: 8, padding: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } },
        },
      },
    };
  }

  // bar
  return {
    ...base,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
        ticks: { font: { size: 10 }, color: '#94a3b8' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#94a3b8' },
      },
    },
  };
};

const barOptions = getDefaultOptions('bar');
const lineOptions = getDefaultOptions('line');
const doughnutOptions = getDefaultOptions('doughnut');

// ─── Stacked bar options ──────────────────────────────────────────────
const stackedBarOptions = {
  ...barOptions,
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false } },
  },
};

// ─── Horizontal ranking options ──────────────────────────────────────
const rankingOptions = {
  ...barOptions,
  indexAxis: 'y',
  scales: {
    x: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false } },
    y: { grid: { display: false } },
  },
};

// ─── Color palette ────────────────────────────────────────────────────
const palette = {
  navy: '#1a3a56',
  navyLight: 'rgba(26, 58, 86, 0.12)',
  green: '#16a34a',
  greenLight: 'rgba(22, 163, 74, 0.15)',
  yellow: '#eab308',
  yellowLight: 'rgba(234, 179, 8, 0.15)',
  red: '#dc2626',
  redLight: 'rgba(220, 38, 38, 0.15)',
  purple: '#8b5cf6',
  purpleLight: 'rgba(139, 92, 246, 0.15)',
  blue: '#3b82f6',
  blueLight: 'rgba(59, 130, 246, 0.15)',
  gray: '#94a3b8',
  grayLight: 'rgba(148, 163, 184, 0.15)',
};

// ─── Helper: build chart datasets with clean colors ────────────────
const buildDataset = (label, data, color, backgroundColor = null) => ({
  label,
  data,
  backgroundColor: backgroundColor || color,
  borderColor: color,
  borderWidth: 2,
  borderRadius: 4,
  hoverBackgroundColor: color,
});

// ─── Component ────────────────────────────────────────────────────────
export default function Analytics({
  auth,
  summary,
  clusterData,
  departmentData,
  monthlyTrend,
  topEvents,
  leastEvents,
  topEmployees,
  inactiveEmployees,
  lateByDepartment,
  lateByCluster,
  lateTrend,
  clusters,
  departments,
  events,
  filters,
  departmentWithHighestRate,
  departmentWithMostLate,
  attendanceGrowth,
  trendForecast,
  attendanceRateRanking,
  eventBreakdown,
  checkinHistogram,
  monthComparison,
}) {
  const [clusterFilter, setClusterFilter] = useState(filters.cluster_id || '');
  const [departmentFilter, setDepartmentFilter] = useState(filters.department_id || '');
  const [eventFilter, setEventFilter] = useState(filters.event_id || '');
  const [yearFilter, setYearFilter] = useState(filters.year || new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const filteredDepartments = departments.filter(
    (dept) => !clusterFilter || dept.cluster_id == clusterFilter
  );

  // ─── Prepare chart data with clean colours ──────────────────────────

  // Event breakdown (stacked bar)
  const eventBreakdownData = {
    labels: (eventBreakdown || []).map(e => e.event),
    datasets: [
      { label: 'Present', data: (eventBreakdown || []).map(e => e.present), backgroundColor: palette.green, borderColor: palette.green, borderWidth: 1 },
      { label: 'Late', data: (eventBreakdown || []).map(e => e.late), backgroundColor: palette.yellow, borderColor: palette.yellow, borderWidth: 1 },
      { label: 'Absent', data: (eventBreakdown || []).map(e => e.absent), backgroundColor: palette.red, borderColor: palette.red, borderWidth: 1 },
    ],
  };

  // Check-in histogram
  const checkinData = {
    labels: Object.keys(checkinHistogram || {}),
    datasets: [
      {
        label: 'Check-ins',
        data: Object.values(checkinHistogram || {}),
        backgroundColor: palette.navy,
        borderRadius: 4,
        borderColor: palette.navy,
        borderWidth: 1,
      },
    ],
  };

  // Attendance rate ranking
  const rankingData = {
    labels: (attendanceRateRanking || []).map(d => d.name),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: (attendanceRateRanking || []).map(d => d.rate),
        backgroundColor: (attendanceRateRanking || []).map(d =>
          d.rate >= 90 ? palette.green : d.rate >= 70 ? palette.yellow : palette.red
        ),
        borderRadius: 4,
        borderColor: 'transparent',
      },
    ],
  };

  // Month comparison
  const monthComparisonData = {
    labels: Array.from({ length: monthComparison?.current_month?.data?.length || 0 }, (_, i) => i + 1),
    datasets: [
      {
        label: monthComparison?.current_month?.label || 'Current Month',
        data: monthComparison?.current_month?.data || [],
        borderColor: palette.navy,
        backgroundColor: palette.navyLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 1.5,
      },
      {
        label: monthComparison?.previous_month?.label || 'Previous Month',
        data: monthComparison?.previous_month?.data || [],
        borderColor: palette.gray,
        backgroundColor: palette.grayLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        borderDash: [5, 5],
        pointRadius: 1.5,
      },
    ],
  };

  // Forecast
  const forecastData = {
    labels: [
      ...(trendForecast?.actual || []).map(d => d.month),
      ...(trendForecast?.forecast || []).map(d => d.month),
    ],
    datasets: [
      {
        label: 'Actual',
        data: [
          ...(trendForecast?.actual || []).map(d => d.count),
          ...Array((trendForecast?.forecast || []).length).fill(null),
        ],
        borderColor: palette.navy,
        backgroundColor: palette.navyLight,
        fill: false,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 1.5,
      },
      {
        label: 'Forecast',
        data: [
          ...Array((trendForecast?.actual || []).length).fill(null),
          ...(trendForecast?.forecast || []).map(d => d.predicted),
        ],
        borderColor: palette.yellow,
        backgroundColor: palette.yellowLight,
        fill: false,
        tension: 0.4,
        borderWidth: 2.5,
        borderDash: [5, 5],
        pointRadius: 1.5,
      },
    ],
  };

  // ─── Growth indicator (no emoji) ──────────────────────────────────
  const GrowthIndicator = ({ percentage }) => {
    const isUp = percentage > 0;
    const isDown = percentage < 0;
    const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
    const color = isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-500';
    return (
      <span className={`inline-flex items-center ${color} font-semibold`}>
        <Icon className="h-4 w-4 mr-1" />
        {isUp ? '+' : ''}{percentage}%
      </span>
    );
  };

  // ─── Animation classes ─────────────────────────────────────────────
  const fadeInUp = `transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
  const fadeIn = `transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`;

  return (
    <HRLayout user={auth.user}>
      <Head title="Analytics" />

      <div className="py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className={fadeInUp} style={{ transitionDelay: '0.05s' }}>
              <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">Attendance insights and performance metrics</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-400 sm:inline">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Filters */}
          <div className={`mb-6 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.1s' }}>
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
                <PrimaryButton onClick={applyFilters} className="px-6 bg-navy-700 hover:bg-navy-800">
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

          {/* KPI Summary Cards – clean white background, no coloured border */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-6">
            {[
              { label: 'Events', value: summary.total_events, icon: Calendar, color: 'text-blue-500' },
              { label: 'Employees', value: summary.total_employees, icon: Users, color: 'text-navy-700' },
              { label: 'Attendances', value: summary.total_attendances, icon: UserCheck, color: 'text-green-600' },
              { label: 'Attendance Rate', value: `${summary.attendance_rate}%`, icon: BarChart3, color: 'text-purple-600' },
              { label: 'Late', value: summary.total_late, icon: AlertTriangle, color: 'text-yellow-600' },
              { label: 'Late Rate', value: `${summary.late_rate}%`, icon: TrendingDown, color: 'text-red-600' },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className={`rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${fadeInUp}`}
                style={{ transitionDelay: `${0.1 + idx * 0.04}s` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{kpi.label}</p>
                    <p className="text-xl font-bold text-navy-800 mt-1">{kpi.value}</p>
                  </div>
                  <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-70`} />
                </div>
              </div>
            ))}
          </div>

          {/* Insight Cards – clean white background */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {departmentWithHighestRate && (
              <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${fadeInUp}`} style={{ transitionDelay: '0.15s' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Highest Attendance</p>
                    <p className="text-base font-bold text-navy-800">{departmentWithHighestRate.name}</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{departmentWithHighestRate.rate}%</p>
                    <p className="text-xs text-gray-400 mt-1">{departmentWithHighestRate.total_attendances} / {departmentWithHighestRate.total_employees} employees</p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </div>
            )}

            {departmentWithMostLate && (
              <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${fadeInUp}`} style={{ transitionDelay: '0.2s' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Most Late Employees</p>
                    <p className="text-base font-bold text-navy-800">{departmentWithMostLate.name}</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{departmentWithMostLate.late_count}</p>
                    <p className="text-xs text-gray-400 mt-1">late employees</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            )}

            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${fadeInUp}`} style={{ transitionDelay: '0.25s' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Attendance Growth</p>
                  <div className="mt-1">
                    <GrowthIndicator percentage={attendanceGrowth?.growth_percentage || 0} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {attendanceGrowth?.current_month_label}: {attendanceGrowth?.current_month || 0} vs {attendanceGrowth?.previous_month_label}: {attendanceGrowth?.previous_month || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${fadeInUp}`} style={{ transitionDelay: '0.3s' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Attendance Trend</p>
                  <p className="text-base font-bold text-navy-800 mt-1">
                    {trendForecast?.trend_direction === 'improving' && 'Improving'}
                    {trendForecast?.trend_direction === 'declining' && 'Declining'}
                    {(!trendForecast?.trend_direction || trendForecast?.trend_direction === 'stable') && 'Stable'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    R²: {trendForecast?.r_squared || 0} · Next month: {trendForecast?.forecast?.[0]?.predicted || 'N/A'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Attendance by Cluster */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.2s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-navy-500" />
                Attendance by Cluster
              </h3>
              <div className="h-64">
                <Doughnut data={clusterData} options={doughnutOptions} />
              </div>
            </div>

            {/* Attendance by Department */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.25s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-navy-500" />
                Attendance by Department
              </h3>
              <div className="h-64">
                <Bar data={departmentData} options={barOptions} />
              </div>
            </div>

            {/* Late by Department */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.3s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-yellow-500" />
                Late by Department
              </h3>
              <div className="h-64">
                <Bar data={lateByDepartment} options={barOptions} />
              </div>
            </div>

            {/* Late by Cluster */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.35s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-yellow-500" />
                Late by Cluster
              </h3>
              <div className="h-64">
                <Doughnut data={lateByCluster} options={doughnutOptions} />
              </div>
            </div>

            {/* Monthly Attendance Trend */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:col-span-2 ${fadeInUp}`} style={{ transitionDelay: '0.4s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-navy-500" />
                Monthly Attendance Trend
              </h3>
              <div className="h-64">
                <Line data={monthlyTrend} options={lineOptions} />
              </div>
            </div>

            {/* Present vs Late Trend */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:col-span-2 ${fadeInUp}`} style={{ transitionDelay: '0.45s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-navy-500" />
                Present vs Late Trend
              </h3>
              <div className="h-64">
                <Line data={lateTrend} options={lineOptions} />
              </div>
            </div>

            {/* Department Attendance Rate Ranking */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:col-span-2 ${fadeInUp}`} style={{ transitionDelay: '0.5s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-navy-500" />
                Department Attendance Rate Ranking
              </h3>
              <div className="h-80">
                <Bar data={rankingData} options={rankingOptions} />
              </div>
            </div>

            {/* Event Attendance Breakdown */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:col-span-2 ${fadeInUp}`} style={{ transitionDelay: '0.55s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-navy-500" />
                Event Attendance Breakdown
              </h3>
              <div className="h-80">
                <Bar data={eventBreakdownData} options={stackedBarOptions} />
              </div>
            </div>

            {/* Peak Check-in Hours */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.6s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-navy-500" />
                Peak Check-in Hours
              </h3>
              <div className="h-64">
                <Bar data={checkinData} options={barOptions} />
              </div>
            </div>

            {/* Month-over-Month Comparison */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.65s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-navy-500" />
                Month-over-Month Comparison
              </h3>
              <div className="h-64">
                <Line data={monthComparisonData} options={lineOptions} />
              </div>
            </div>

            {/* Attendance Forecast */}
            <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:col-span-2 ${fadeInUp}`} style={{ transitionDelay: '0.7s' }}>
              <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-purple-500" />
                Attendance Forecast
              </h3>
              <p className="text-xs text-gray-400 mb-3">Simple linear regression • R² = {trendForecast?.r_squared || 0}</p>
              <div className="h-64">
                <Line data={forecastData} options={lineOptions} />
              </div>
            </div>
          </div>

          {/* Lists */}
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.2s' }}>
                <h3 className="text-base font-semibold text-navy-800 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Most Attended Events
                </h3>
                {topEvents.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-400">No events yet.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-gray-100">
                    {topEvents.map((event) => (
                      <li key={event.id} className="flex justify-between py-2 text-sm">
                        <span className="text-gray-700">{event.title}</span>
                        <span className="font-medium text-navy-700">{event.attendances_count} attendees</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.25s' }}>
                <h3 className="text-base font-semibold text-navy-800 flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                  Least Attended Events
                </h3>
                {leastEvents.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-400">No events yet.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-gray-100">
                    {leastEvents.map((event) => (
                      <li key={event.id} className="flex justify-between py-2 text-sm">
                        <span className="text-gray-700">{event.title}</span>
                        <span className="font-medium text-gray-500">{event.attendances_count} attendees</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.3s' }}>
                <h3 className="text-base font-semibold text-navy-800 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-green-500" />
                  Most Active Employees
                </h3>
                {topEmployees.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-400">No data.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-gray-100">
                    {topEmployees.map((emp) => (
                      <li key={emp.id} className="flex justify-between py-2 text-sm">
                        <span className="text-gray-700">{emp.full_name}</span>
                        <span className="font-medium text-navy-700">{emp.attendances_count} attendances</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 ${fadeInUp}`} style={{ transitionDelay: '0.35s' }}>
                <h3 className="text-base font-semibold text-navy-800 flex items-center">
                  <UserX className="h-5 w-5 mr-2 text-red-500" />
                  Inactive Employees
                </h3>
                {inactiveEmployees.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-400">All employees have attended.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-gray-100 max-h-48 overflow-y-auto">
                    {inactiveEmployees.map((emp) => (
                      <li key={emp.id} className="py-2 text-sm">
                        <span className="text-gray-700">{emp.full_name}</span>
                        <span className="ml-2 text-xs text-gray-400">({emp.department?.name ?? 'Unassigned'})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
