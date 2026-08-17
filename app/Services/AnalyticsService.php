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
    // ==============================
    // EXISTING METHODS (unchanged)
    // ==============================

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

   public function getAttendanceByCluster($filters = [])
{
    $query = Cluster::query()
        ->withCount(['employees' => function ($q) use ($filters) {
            $q->whereHas('attendances', function ($sq) use ($filters) {
                // Only count attendances with status 'present' or 'late'
                $sq->whereIn('status', ['present', 'late']);
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



  public function getAttendanceByDepartment($filters = [])
{
    $query = Department::query()
        ->withCount(['employees' => function ($q) use ($filters) {
            $q->whereHas('attendances', function ($sq) use ($filters) {
                // Only count attendances with status 'present' or 'late'
                $sq->whereIn('status', ['present', 'late']);
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




    public function getMonthlyTrend($filters = [])
    {
        $year = $filters['year'] ?? Carbon::now()->year;

        $query = Attendance::select(
            DB::raw('MONTH(time_in) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->whereYear('time_in', $year)
             ->whereIn('status', ['present', 'late'])
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

 public function getTopEvents($limit = 5, $filters = [])
{
    $query = Event::withCount(['attendances' => function ($q) {
        $q->whereIn('status', ['present', 'late']);
    }])
        ->orderBy('attendances_count', 'desc')
        ->limit($limit);

    if (!empty($filters['year'])) {
        $query->whereYear('date', $filters['year']);
    }

    return $query->get(['id', 'title', 'date', 'attendances_count']);
}



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

   public function getTopEmployees($limit = 5, $filters = [])
{
    $query = Employee::withCount(['attendances' => function ($q) {
        $q->whereIn('status', ['present', 'late']);
    }])
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

    // ==============================
    // NEW METHODS
    // ==============================

    /**
     * Get department with highest attendance rate.
     */
    public function getDepartmentWithHighestAttendanceRate(array $filters = [])
    {
        $ranking = $this->getAttendanceRateRanking($filters);
        return $ranking->first();
    }

    /**
     * Get department with most late employees.
     */
    public function getDepartmentWithMostLateEmployees(array $filters = [])
    {
        $query = Department::select(
            'departments.id',
            'departments.name',
            DB::raw('COUNT(DISTINCT attendance.employee_id) as late_count')
        )
        ->leftJoin('employees', 'employees.department_id', '=', 'departments.id')
        ->leftJoin('attendance', function ($join) {
            $join->on('attendance.employee_id', '=', 'employees.id')
                 ->where('attendance.status', '=', 'late');
        })
        ->leftJoin('events', 'attendance.event_id', '=', 'events.id');

        $this->applyFiltersToDepartmentQuery($query, $filters);

        $result = $query->groupBy('departments.id', 'departments.name')
            ->having('late_count', '>', 0)
            ->orderBy('late_count', 'desc')
            ->first();

        return $result;
    }

    /**
     * Get attendance growth vs last month.
     */
    public function getAttendanceGrowth(array $filters = [])
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $previousMonth = Carbon::now()->subMonth()->month;
        $previousYear = Carbon::now()->subMonth()->year;

        // Current month attendance
        $currentQuery = Attendance::query()
            ->whereMonth('time_in', $currentMonth)
            ->whereYear('time_in', $currentYear);

        $this->applyFiltersToAttendanceQuery($currentQuery, $filters);
        $currentCount = $currentQuery->count();

        // Previous month attendance
        $previousQuery = Attendance::query()
            ->whereMonth('time_in', $previousMonth)
            ->whereYear('time_in', $previousYear);

        $this->applyFiltersToAttendanceQuery($previousQuery, $filters);
        $previousCount = $previousQuery->count();

        $growth = $previousCount > 0
            ? round((($currentCount - $previousCount) / $previousCount) * 100, 1)
            : ($currentCount > 0 ? 100 : 0);

        return [
            'current_month' => $currentCount,
            'previous_month' => $previousCount,
            'growth_percentage' => $growth,
            'trend' => $growth > 0 ? 'up' : ($growth < 0 ? 'down' : 'neutral'),
            'current_month_label' => Carbon::now()->format('M Y'),
            'previous_month_label' => Carbon::now()->subMonth()->format('M Y'),
        ];
    }

    /**
     * Get trend forecast using simple linear regression.
     */
    public function getTrendForecast(array $filters = [], int $months = 6)
    {
        // Get attendance data for the last 12 months
        $data = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $month = $date->month;
            $year = $date->year;

            $count = Attendance::query()
                ->whereMonth('time_in', $month)
                ->whereYear('time_in', $year);

            $this->applyFiltersToAttendanceQuery($count, $filters);

            $data[] = [
                'month' => $date->format('M Y'),
                'month_index' => $i,
                'count' => $count->count(),
            ];
        }

        // Simple linear regression
        $n = count($data);
        if ($n < 3) {
            return [
                'forecast' => [],
                'actual' => $data,
                'r_squared' => 0,
                'message' => 'Not enough data for forecast',
                'trend_direction' => 'insufficient_data',
            ];
        }

        $sumX = array_sum(array_column($data, 'month_index'));
        $sumY = array_sum(array_column($data, 'count'));
        $sumXY = array_sum(array_map(function ($d) {
            return $d['month_index'] * $d['count'];
        }, $data));
        $sumX2 = array_sum(array_map(function ($d) {
            return $d['month_index'] * $d['month_index'];
        }, $data));

        $slope = ($n * $sumXY - $sumX * $sumY) / ($n * $sumX2 - $sumX * $sumX);
        $intercept = ($sumY - $slope * $sumX) / $n;

        // Generate forecast for next 3 months
        $forecast = [];
        for ($i = 1; $i <= 3; $i++) {
            $nextIndex = $data[0]['month_index'] + $i;
            $predicted = round($slope * $nextIndex + $intercept);
            $forecast[] = [
                'month' => Carbon::now()->addMonths($i)->format('M Y'),
                'predicted' => max(0, $predicted),
            ];
        }

        // Calculate R-squared
        $meanY = $sumY / $n;
        $ssTot = array_sum(array_map(function ($d) use ($meanY) {
            return pow($d['count'] - $meanY, 2);
        }, $data));
        $ssRes = array_sum(array_map(function ($d) use ($slope, $intercept) {
            $predicted = $slope * $d['month_index'] + $intercept;
            return pow($d['count'] - $predicted, 2);
        }, $data));
        $rSquared = $ssTot > 0 ? round(1 - ($ssRes / $ssTot), 3) : 0;

        return [
            'forecast' => $forecast,
            'actual' => $data,
            'slope' => round($slope, 2),
            'intercept' => round($intercept, 2),
            'r_squared' => $rSquared,
            'trend_direction' => $slope > 0 ? 'improving' : ($slope < 0 ? 'declining' : 'stable'),
        ];
    }

    /**
     * Get attendance rate ranking by department.
     */
    public function getAttendanceRateRanking(array $filters = [])
    {
        $eventCount = $this->getEventCount($filters);

        $query = Department::select(
            'departments.id',
            'departments.name',
            DB::raw('COUNT(DISTINCT employees.id) as total_employees'),
            DB::raw('COUNT(DISTINCT attendance.id) as total_attendances')
        )
        ->leftJoin('employees', 'employees.department_id', '=', 'departments.id')
        ->leftJoin('attendance', 'attendance.employee_id', '=', 'employees.id')
        ->leftJoin('events', 'attendance.event_id', '=', 'events.id');

        $this->applyFiltersToDepartmentQuery($query, $filters);

        $results = $query->groupBy('departments.id', 'departments.name')
            ->having('total_employees', '>', 0)
            ->get()
            ->map(function ($dept) use ($eventCount) {
                $expected = $dept->total_employees * $eventCount;
                $rate = $expected > 0 ? round(($dept->total_attendances / $expected) * 100, 1) : 0;
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'rate' => $rate,
                    'total_employees' => $dept->total_employees,
                    'total_attendances' => $dept->total_attendances,
                ];
            })
            ->sortByDesc('rate')
            ->values();

        return $results;
    }

    /**
     * Get event breakdown: present, late, absent per event.
     */
    public function getEventBreakdown(array $filters = [])
    {
        $eventsQuery = Event::query();

        if (isset($filters['year'])) {
            $eventsQuery->whereYear('date', $filters['year']);
        }

        $events = $eventsQuery->get();

        $eventData = [];
        foreach ($events as $event) {
            $present = Attendance::where('event_id', $event->id)
                ->where('status', 'present')
                ->count();
            $late = Attendance::where('event_id', $event->id)
                ->where('status', 'late')
                ->count();
            $required = $event->requiredEmployees()->count();
            $absent = max(0, $required - ($present + $late));

            $eventData[] = [
                'event' => $event->title,
                'present' => $present,
                'late' => $late,
                'absent' => $absent,
                'total' => $present + $late + $absent,
            ];
        }

        return $eventData;
    }

    /**
     * Get check-in histogram (peak hours).
     */
    public function getCheckinHistogram(array $filters = [])
    {
        $query = Attendance::query()
            ->select(
                DB::raw('HOUR(time_in) as hour'),
                DB::raw('COUNT(*) as count')
            );

        $this->applyFiltersToAttendanceQuery($query, $filters);

        $results = $query->groupBy('hour')
            ->orderBy('hour')
            ->pluck('count', 'hour')
            ->toArray();

        // Ensure all hours from 6 AM to 10 PM are represented
        $fullRange = [];
        for ($i = 6; $i <= 22; $i++) {
            $label = sprintf('%02d:00 - %02d:59', $i, $i);
            $fullRange[$label] = $results[$i] ?? 0;
        }

        return $fullRange;
    }

    /**
     * Get month-over-month comparison (daily attendance).
     */
    public function getMonthComparison(array $filters = [])
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $previousMonth = Carbon::now()->subMonth()->month;
        $previousYear = Carbon::now()->subMonth()->year;

        $currentDaily = $this->getDailyAttendance($currentMonth, $currentYear, $filters);
        $previousDaily = $this->getDailyAttendance($previousMonth, $previousYear, $filters);

        return [
            'current_month' => [
                'label' => Carbon::now()->format('M Y'),
                'data' => $currentDaily,
                'total' => array_sum($currentDaily),
            ],
            'previous_month' => [
                'label' => Carbon::now()->subMonth()->format('M Y'),
                'data' => $previousDaily,
                'total' => array_sum($previousDaily),
            ],
        ];
    }

    // ==============================
    // PRIVATE HELPERS
    // ==============================

    /**
     * Apply cluster/department/event filters to a department query.
     */
    private function applyFiltersToDepartmentQuery($query, $filters)
    {
        if (!empty($filters['cluster_id'])) {
            $query->where('departments.cluster_id', $filters['cluster_id']);
        }

        if (!empty($filters['department_id'])) {
            $query->where('departments.id', $filters['department_id']);
        }

        if (!empty($filters['event_id'])) {
            $query->where('events.id', $filters['event_id']);
        }

        if (!empty($filters['year'])) {
            $query->whereYear('events.date', $filters['year']);
        }
    }

    /**
     * Apply cluster/department/event filters to an attendance query.
     */
    private function applyFiltersToAttendanceQuery($query, $filters)
    {
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
    }

    /**
     * Get count of events (optionally filtered by year).
     */
    private function getEventCount($filters)
    {
        $query = Event::query();

        if (!empty($filters['year'])) {
            $query->whereYear('date', $filters['year']);
        }

        return $query->count();
    }

    /**
     * Get daily attendance for a specific month/year.
     */
    private function getDailyAttendance($month, $year, $filters)
    {
        $daysInMonth = Carbon::create($year, $month)->daysInMonth;
        $daily = array_fill(0, $daysInMonth, 0);

        $query = Attendance::query()
            ->select(
                DB::raw('DAY(time_in) as day'),
                DB::raw('COUNT(*) as count')
            )
            ->whereMonth('time_in', $month)
            ->whereYear('time_in', $year);

        $this->applyFiltersToAttendanceQuery($query, $filters);

        $results = $query->groupBy('day')
            ->pluck('count', 'day');

        foreach ($results as $day => $count) {
            $daily[$day - 1] = $count;
        }

        return $daily;
    }
}
