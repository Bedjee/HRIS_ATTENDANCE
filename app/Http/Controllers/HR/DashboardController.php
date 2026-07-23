<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Event;
use App\Models\Attendance;
use App\Models\Cluster;
use App\Models\Department;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Summary Statistics
        $totalEmployees = Employee::count();
        $totalClusters = Cluster::count();
        $totalDepartments = Department::count();
        $totalEvents = Event::count();
        $activeEvents = Event::where('status', 'ongoing')->count();
        $todayAttendance = Attendance::whereDate('time_in', Carbon::today())->count();
        $totalAttendanceRecords = Attendance::count();

        // Today's Overview
        $ongoingEvent = Event::where('status', 'ongoing')->first();
        $upcomingEvent = Event::where('status', 'upcoming')
            ->where('date', '>=', Carbon::today())
            ->orderBy('date')
            ->first();

        $employeesCheckedInToday = Attendance::whereDate('time_in', Carbon::today())
            ->distinct('employee_id')
            ->count();

        $mostRecentAttendance = Attendance::with(['employee', 'event'])
            ->latest()
            ->first();

        // Upcoming Events (next 5)
        $upcomingEvents = Event::where('status', 'upcoming')
            ->where('date', '>=', Carbon::today())
            ->orderBy('date')
            ->limit(5)
            ->get(['id', 'title', 'date', 'time', 'venue']);

        // Recent Activity Feed (combine recent events, attendance, employees)
        $recentEvents = Event::latest()->limit(5)->get()->map(function ($item) {
            return [
                'type' => 'event_created',
                'title' => $item->title,
                'created_at' => $item->created_at,
                'url' => route('hr.events.edit', $item->id),
            ];
        });

        $recentAttendance = Attendance::with(['employee', 'event'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'type' => 'attendance_recorded',
                    'employee_name' => $item->employee->full_name,
                    'event_title' => $item->event->title,
                    'created_at' => $item->created_at,
                ];
            });

        $recentEmployees = Employee::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'type' => 'employee_imported',
                    'full_name' => $item->full_name,
                    'created_at' => $item->created_at,
                ];
            });

        // Merge and sort by created_at descending
        $recentActivity = collect()
            ->merge($recentEvents)
            ->merge($recentAttendance)
            ->merge($recentEmployees)
            ->sortByDesc('created_at')
            ->take(10)
            ->values()
            ->all();

        // Build required summary for ongoing event
        $ongoingEventData = null;
        if ($ongoingEvent) {
            $requiredSummary = [];
            switch ($ongoingEvent->attendance_mode) {
                case 'all_employees':
                    $requiredSummary['mode'] = 'All Employees';
                    break;
                case 'selected_clusters':
                    $clusters = Cluster::whereIn('id', $ongoingEvent->selected_clusters ?? [])->pluck('name')->toArray();
                    $requiredSummary['mode'] = 'Selected Clusters';
                    $requiredSummary['clusters'] = $clusters;
                    break;
                case 'selected_departments':
                    $depts = Department::whereIn('id', $ongoingEvent->selected_departments ?? [])->pluck('name')->toArray();
                    $requiredSummary['mode'] = 'Selected Departments';
                    $requiredSummary['departments'] = $depts;
                    break;
                case 'selected_employees':
                    $count = $ongoingEvent->requiredEmployees()->count();
                    $requiredSummary['mode'] = 'Selected Employees';
                    $requiredSummary['total'] = $count;
                    break;
            }

            $ongoingEventData = [
                'id' => $ongoingEvent->id,
                'title' => $ongoingEvent->title,
                'date' => $ongoingEvent->date,
                'time' => $ongoingEvent->time,
                'venue' => $ongoingEvent->venue,
                'required_summary' => $requiredSummary,
            ];
        }

        return Inertia::render('HR/Dashboard', [
            'summary' => [
                'total_employees' => $totalEmployees,
                'total_clusters' => $totalClusters,
                'total_departments' => $totalDepartments,
                'total_events' => $totalEvents,
                'active_events' => $activeEvents,
                'today_attendance' => $todayAttendance,
                'total_attendance_records' => $totalAttendanceRecords,
            ],
            'todayOverview' => [
                'ongoing_event' => $ongoingEventData,
                'upcoming_event' => $upcomingEvent ? [
                    'id' => $upcomingEvent->id,
                    'title' => $upcomingEvent->title,
                    'date' => $upcomingEvent->date,
                    'time' => $upcomingEvent->time,
                    'venue' => $upcomingEvent->venue,
                ] : null,
                'employees_checked_in_today' => $employeesCheckedInToday,
                'most_recent_attendance' => $mostRecentAttendance ? [
                    'employee_name' => $mostRecentAttendance->employee->full_name,
                    'event_title' => $mostRecentAttendance->event->title,
                    'time_in' => $mostRecentAttendance->time_in,
                ] : null,
            ],
            'upcomingEvents' => $upcomingEvents,
            'recentActivity' => $recentActivity,
        ]);
    }
}
