<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cluster;
use App\Models\Department;
use App\Models\Event;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['cluster_id', 'department_id', 'event_id', 'year']);

        // Existing data
        $summary = $this->analyticsService->getSummaryStats($filters);
        $clusterData = $this->analyticsService->getAttendanceByCluster($filters);
        $departmentData = $this->analyticsService->getAttendanceByDepartment($filters);
        $monthlyTrend = $this->analyticsService->getMonthlyTrend($filters);
        $topEvents = $this->analyticsService->getTopEvents(5, $filters);
        $leastEvents = $this->analyticsService->getLeastEvents(5, $filters);
        $topEmployees = $this->analyticsService->getTopEmployees(5, $filters);
        $inactiveEmployees = $this->analyticsService->getInactiveEmployees(10, $filters);
        $lateByDepartment = $this->analyticsService->getLateByDepartment($filters);
        $lateByCluster = $this->analyticsService->getLateByCluster($filters);
        $lateTrend = $this->analyticsService->getLateTrend($filters);

        // NEW DATA
        $departmentWithHighestRate = $this->analyticsService->getDepartmentWithHighestAttendanceRate($filters);
        $departmentWithMostLate = $this->analyticsService->getDepartmentWithMostLateEmployees($filters);
        $attendanceGrowth = $this->analyticsService->getAttendanceGrowth($filters);
        $trendForecast = $this->analyticsService->getTrendForecast($filters);
        $attendanceRateRanking = $this->analyticsService->getAttendanceRateRanking($filters);
        $eventBreakdown = $this->analyticsService->getEventBreakdown($filters);
        $checkinHistogram = $this->analyticsService->getCheckinHistogram($filters);
        $monthComparison = $this->analyticsService->getMonthComparison($filters);

        $clusters = Cluster::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'cluster_id')->get();
        $events = Event::select('id', 'title')->get();

        return Inertia::render('HR/Reports/Analytics', [
            // Existing
            'summary' => $summary,
            'clusterData' => $clusterData,
            'departmentData' => $departmentData,
            'monthlyTrend' => $monthlyTrend,
            'topEvents' => $topEvents,
            'leastEvents' => $leastEvents,
            'topEmployees' => $topEmployees,
            'inactiveEmployees' => $inactiveEmployees,
            'lateByDepartment' => $lateByDepartment,
            'lateByCluster' => $lateByCluster,
            'lateTrend' => $lateTrend,
            // New
            'departmentWithHighestRate' => $departmentWithHighestRate,
            'departmentWithMostLate' => $departmentWithMostLate,
            'attendanceGrowth' => $attendanceGrowth,
            'trendForecast' => $trendForecast,
            'attendanceRateRanking' => $attendanceRateRanking,
            'eventBreakdown' => $eventBreakdown,
            'checkinHistogram' => $checkinHistogram,
            'monthComparison' => $monthComparison,
            // Filters/lists
            'clusters' => $clusters,
            'departments' => $departments,
            'events' => $events,
            'filters' => $filters,
        ]);
    }
}
