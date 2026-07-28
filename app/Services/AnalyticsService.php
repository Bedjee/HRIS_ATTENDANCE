<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Cluster;
use App\Models\Department;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Get summary statistics (already fine).
     */
   public function getSummaryStats($filters = [])
    {
        $totalEvents = Event::count();
        $totalEmployees = Employee::count();
        $totalAttendances = Attendance::count();
        $totalClusters = Cluster::count();
        $totalDepartments = Department::count();
        $totalLate = Attendance::where('status', 'late')->count();

        $attendanceRate = 0;
        $lateRate = 0;
        if ($totalEmployees > 0 && $totalEvents > 0) {
            $attendanceRate = round(($totalAttendances / ($totalEmployees * $totalEvents)) * 100, 2);
            $lateRate = round(($totalLate / ($totalEmployees * $totalEvents)) * 100, 2);
        }

        return [
            'total_events' => $totalEvents,
            'total_employees' => $totalEmployees,
            'total_attendances' => $totalAttendances,
            'attendance_rate' => $attendanceRate,
            'total_clusters' => $totalClusters,
            'total_departments' => $totalDepartments,
            'total_late' => $totalLate,
            'late_rate' => $lateRate,
        ];
    }

    /**
     * Get attendance by cluster (number of distinct employees who have attended,
     * or total attendance records). We'll show distinct employees who attended.
     */
    public function getAttendanceByCluster($filters = [])
    {
        $query = Cluster::query()
            ->withCount(['employees' => function ($q) use ($filters) {
                // Distinct employees who have at least one attendance record
                $q->whereHas('attendances', function ($sq) use ($filters) {
                    if (!empty($filters['event_id'])) {
                        $sq->where('event_id', $filters['event_id']);
                    }
                    if (!empty($filters['year'])) {
                        $sq->whereYear('time_in', $filters['year']);
                    }
                });
            }]);

        $clusters = $query->get();

        $labels = $clusters->pluck('name')->toArray();
        $data = $clusters->pluck('employees_count')->toArray();

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Employees who attended',
                    'data' => $data,
                    'backgroundColor' => ['#2a5e85', '#4f7a9c', '#7696b3', '#9eb3c9', '#c5d0df'],
                ],
            ],
        ];
    }

    /**
     * Get attendance by department (distinct employees who attended).
     */
    public function getAttendanceByDepartment($filters = [])
    {
        $query = Department::query()
            ->withCount(['employees' => function ($q) use ($filters) {
                $q->whereHas('attendances', function ($sq) use ($filters) {
                    if (!empty($filters['event_id'])) {
                        $sq->where('event_id', $filters['event_id']);
                    }
                    if (!empty($filters['year'])) {
                        $sq->whereYear('time_in', $filters['year']);
                    }
                });
            }]);

        if (!empty($filters['cluster_id'])) {
            $query->where('cluster_id', $filters['cluster_id']);
        }

        $departments = $query->get();

        $labels = $departments->pluck('name')->toArray();
        $data = $departments->pluck('employees_count')->toArray();

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Employees who attended',
                    'data' => $data,
                    'backgroundColor' => '#2a5e85',
                ],
            ],
        ];
    }

    /**
     * Get monthly attendance trend (already fine – counts attendance records).
     */
    public function getMonthlyTrend($filters = [])
    {
        $year = $filters['year'] ?? Carbon::now()->year;

        $query = Attendance::select(
            DB::raw('MONTH(time_in) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->whereYear('time_in', $year)
            ->groupBy('month')
            ->orderBy('month');

        if (!empty($filters['cluster_id'])) {
            $query->whereHas('employee.department', function ($q) use ($filters) {
                $q->where('cluster_id', $filters['cluster_id']);
            });
        }

        if (!empty($filters['department_id'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }

        if (!empty($filters['event_id'])) {
            $query->where('event_id', $filters['event_id']);
        }

        $results = $query->get()->keyBy('month');

        $months = range(1, 12);
        $labels = [];
        $data = [];

        foreach ($months as $month) {
            $labels[] = Carbon::createFromDate($year, $month, 1)->format('M');
            $data[] = $results->get($month)->total ?? 0;
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Attendance',
                    'data' => $data,
                    'borderColor' => '#2a5e85',
                    'backgroundColor' => 'rgba(42, 94, 133, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
        ];
    }

    /**
     * Get top attended events (already fine).
     */
    public function getTopEvents($limit = 5, $filters = [])
    {
        $query = Event::withCount('attendances')
            ->orderBy('attendances_count', 'desc')
            ->limit($limit);

        if (!empty($filters['year'])) {
            $query->whereYear('date', $filters['year']);
        }

        return $query->get(['id', 'title', 'date', 'attendances_count']);
    }

    /**
     * Get least attended events (already fine).
     */
    public function getLeastEvents($limit = 5, $filters = [])
    {
        $query = Event::withCount('attendances')
            ->orderBy('attendances_count', 'asc')
            ->limit($limit);

        if (!empty($filters['year'])) {
            $query->whereYear('date', $filters['year']);
        }

        return $query->get(['id', 'title', 'date', 'attendances_count']);
    }

    /**
     * Get top employees by attendance count (already fine).
     */
    public function getTopEmployees($limit = 5, $filters = [])
    {
        $query = Employee::withCount('attendances')
            ->with('department.cluster')
            ->orderBy('attendances_count', 'desc')
            ->limit($limit);

        if (!empty($filters['cluster_id'])) {
            $query->whereHas('department', function ($q) use ($filters) {
                $q->where('cluster_id', $filters['cluster_id']);
            });
        }

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        return $query->get();
    }

    /**
     * Get employees with no attendance (already fine).
     */
    public function getInactiveEmployees($limit = 10, $filters = [])
    {
        $query = Employee::with('department.cluster')
            ->whereDoesntHave('attendances')
            ->limit($limit);

        if (!empty($filters['cluster_id'])) {
            $query->whereHas('department', function ($q) use ($filters) {
                $q->where('cluster_id', $filters['cluster_id']);
            });
        }

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        return $query->get();
    }



     public function getLateByDepartment($filters = [])
    {
        $query = Department::query()
            ->withCount(['employees' => function ($q) use ($filters) {
                $q->whereHas('attendances', function ($sq) use ($filters) {
                    $sq->where('status', 'late');
                    if (!empty($filters['event_id'])) {
                        $sq->where('event_id', $filters['event_id']);
                    }
                    if (!empty($filters['year'])) {
                        $sq->whereYear('time_in', $filters['year']);
                    }
                });
            }]);

        if (!empty($filters['cluster_id'])) {
            $query->where('cluster_id', $filters['cluster_id']);
        }

        $departments = $query->get();

        $labels = $departments->pluck('name')->toArray();
        $data = $departments->pluck('employees_count')->toArray();

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Late Employees',
                    'data' => $data,
                    'backgroundColor' => '#facc15',
                ],
            ],
        ];
    }

    /**
     * Get late attendance by cluster.
     */
    public function getLateByCluster($filters = [])
    {
        $query = Cluster::query()
            ->withCount(['employees' => function ($q) use ($filters) {
                $q->whereHas('attendances', function ($sq) use ($filters) {
                    $sq->where('status', 'late');
                    if (!empty($filters['event_id'])) {
                        $sq->where('event_id', $filters['event_id']);
                    }
                    if (!empty($filters['year'])) {
                        $sq->whereYear('time_in', $filters['year']);
                    }
                });
            }]);

        $clusters = $query->get();

        $labels = $clusters->pluck('name')->toArray();
        $data = $clusters->pluck('employees_count')->toArray();

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Late Employees',
                    'data' => $data,
                    'backgroundColor' => ['#facc15', '#fde047', '#fef08a', '#fef9c3', '#fefce8'],
                ],
            ],
        ];
    }

    /**
     * Get monthly trend for present vs late.
     */
    public function getLateTrend($filters = [])
    {
        $year = $filters['year'] ?? Carbon::now()->year;

        $query = Attendance::select(
            DB::raw('MONTH(time_in) as month'),
            DB::raw('COUNT(*) as total'),
            DB::raw('SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late_count')
        )
            ->whereYear('time_in', $year)
            ->groupBy('month')
            ->orderBy('month');

        if (!empty($filters['cluster_id'])) {
            $query->whereHas('employee.department', function ($q) use ($filters) {
                $q->where('cluster_id', $filters['cluster_id']);
            });
        }

        if (!empty($filters['department_id'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }

        if (!empty($filters['event_id'])) {
            $query->where('event_id', $filters['event_id']);
        }

        $results = $query->get()->keyBy('month');

        $months = range(1, 12);
        $labels = [];
        $presentData = [];
        $lateData = [];

        foreach ($months as $month) {
            $labels[] = Carbon::createFromDate($year, $month, 1)->format('M');
            $row = $results->get($month);
            $presentData[] = $row ? $row->total - $row->late_count : 0;
            $lateData[] = $row ? $row->late_count : 0;
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Present',
                    'data' => $presentData,
                    'borderColor' => '#22c55e',
                    'backgroundColor' => 'rgba(34, 197, 94, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
                [
                    'label' => 'Late',
                    'data' => $lateData,
                    'borderColor' => '#facc15',
                    'backgroundColor' => 'rgba(250, 204, 21, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
        ];
    }

}
