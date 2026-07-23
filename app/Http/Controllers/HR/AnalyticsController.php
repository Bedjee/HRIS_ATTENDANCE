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

        $summary = $this->analyticsService->getSummaryStats($filters);
        $clusterData = $this->analyticsService->getAttendanceByCluster($filters);
        $departmentData = $this->analyticsService->getAttendanceByDepartment($filters);
        $monthlyTrend = $this->analyticsService->getMonthlyTrend($filters);
        $topEvents = $this->analyticsService->getTopEvents(5, $filters);
        $leastEvents = $this->analyticsService->getLeastEvents(5, $filters);
        $topEmployees = $this->analyticsService->getTopEmployees(5, $filters);
        $inactiveEmployees = $this->analyticsService->getInactiveEmployees(10, $filters);

        $clusters = Cluster::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'cluster_id')->get();
        $events = Event::select('id', 'title')->get();

        return Inertia::render('HR/Reports/Analytics', [
            'summary' => $summary,
            'clusterData' => $clusterData,
            'departmentData' => $departmentData,
            'monthlyTrend' => $monthlyTrend,
            'topEvents' => $topEvents,
            'leastEvents' => $leastEvents,
            'topEmployees' => $topEmployees,
            'inactiveEmployees' => $inactiveEmployees,
            'clusters' => $clusters,
            'departments' => $departments,
            'events' => $events,
            'filters' => $filters,
        ]);
    }
}
