<?php

namespace App\Http\Controllers\HR;
use App\Models\Attendance;
use App\Models\Cluster;
use App\Models\Department;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Services\EventService;

use Carbon\Carbon;
use App\Models\Employee;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    protected $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(Request $request)
{
    $perPage = $request->input('per_page', 10);
    $events = Event::withCount('requiredEmployees')
        ->orderBy('date', 'desc')
        ->paginate($perPage);
    return Inertia::render('HR/Events/Index', ['events' => $events]);
}

    public function create()
    {
        $clusters = Cluster::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'cluster_id')->get();
        $employees = Employee::with('department')->get(['id', 'first_name', 'last_name', 'department_id']);
        return Inertia::render('HR/Events/Create', [
            'clusters' => $clusters,
            'departments' => $departments,
            'employees' => $employees,
        ]);
    }

    public function store(StoreEventRequest $request)
    {
        try {
            $data = $request->validated();
            $data['selected_clusters'] = $request->input('selected_clusters', []);
            $data['selected_departments'] = $request->input('selected_departments', []);
            $data['employee_ids'] = $request->input('employee_ids', []);
            $this->eventService->createEvent($data);
            return redirect()->route('hr.events.index')
                ->with('success', 'Event created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create event: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $event = $this->eventService->getEventById($id);
        $clusters = Cluster::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'cluster_id')->get();
        $employees = Employee::with('department')->get(['id', 'first_name', 'last_name', 'department_id']);
        $selectedEmployeeIds = $event->requiredEmployees()->pluck('employee_id')->toArray();

        return Inertia::render('HR/Events/Edit', [
            'event' => $event,
            'clusters' => $clusters,
            'departments' => $departments,
            'employees' => $employees,
            'selectedEmployeeIds' => $selectedEmployeeIds,
        ]);
    }

    public function update(StoreEventRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $data['selected_clusters'] = $request->input('selected_clusters', []);
            $data['selected_departments'] = $request->input('selected_departments', []);
            $data['employee_ids'] = $request->input('employee_ids', []);
            $this->eventService->updateEvent($id, $data);
            return redirect()->route('hr.events.index')
                ->with('success', 'Event updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update event: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $this->eventService->deleteEvent($id);
            return redirect()->route('hr.events.index')
                ->with('success', 'Event deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete event: ' . $e->getMessage());
        }
    }








private function getAssignmentSource($employee, $event)
{
    $mode = $event->attendance_mode;
    if ($mode === 'all_employees') return 'All Employees';
    if ($mode === 'selected_clusters') {
        $clusterIds = $event->selected_clusters ?? [];
        if ($employee->department && in_array($employee->department->cluster_id, $clusterIds)) {
            return 'Selected Cluster';
        }
    }
    if ($mode === 'selected_departments') {
        $deptIds = $event->selected_departments ?? [];
        if ($employee->department_id && in_array($employee->department_id, $deptIds)) {
            return 'Selected Department';
        }
    }
    if ($mode === 'selected_employees') return 'Selected Employee';
    return '—';
}

public function required(Event $event)
{
    $requiredEmployees = $event->requiredEmployees()
        ->with(['department.cluster', 'user'])
        ->get();

    $presentRecords = Attendance::where('event_id', $event->id)
        ->pluck('time_in', 'employee_id');

    $required = $requiredEmployees->map(function ($emp) use ($event, $presentRecords) {
        $attTime = $presentRecords->get($emp->id);
        $status = $attTime ? 'present' : 'pending';
        return [
            'id' => $emp->id,
            'employee_name' => $emp->full_name,
            'department' => $emp->department?->name ?? 'Unassigned',
            'cluster' => $emp->department?->cluster?->name ?? '—',
            'assignment_source' => $this->getAssignmentSource($emp, $event),
            'status' => $status,
            'time_in' => $attTime,
        ];
    })->values();

    $clusters = Cluster::select('id', 'name')->get();
    $departments = Department::select('id', 'name', 'cluster_id')->get();

    return Inertia::render('HR/Events/Required', [
        'event' => [
            'id' => $event->id,
            'title' => $event->title,
            'date' => $event->date,
            'time' => $event->time,
            'venue' => $event->venue,
            'attendance_mode' => $event->attendance_mode,
        ],
        'required' => $required,
        'summary' => [
            'total_required' => $required->count(),
            'total_present' => $required->where('status', 'present')->count(),
            'total_pending' => $required->where('status', 'pending')->count(),
        ],
        'clusters' => $clusters,
        'departments' => $departments,
    ]);
}

/**
     * Attendance Details page – final outcome (Present / Absent) with manual attendance support.
     */
    public function attendance(Event $event)
    {
        // Get all required employees with department and cluster
        $requiredEmployees = $event->requiredEmployees()
            ->with(['department.cluster', 'user'])
            ->get();

        // Present records: employee_id => time_in
        $presentRecords = Attendance::where('event_id', $event->id)
            ->pluck('time_in', 'employee_id');

        // Determine if event has ended
        $eventDate = Carbon::parse($event->date . ' ' . $event->time);
        $isPast = $eventDate->isPast();

        $present = collect();
        $absent = collect();

        foreach ($requiredEmployees as $emp) {
            $attTime = $presentRecords->get($emp->id);
            if ($attTime) {
                $present->push([
                    'id' => $emp->id,
                    'employee_name' => $emp->full_name,
                    'department' => $emp->department?->name ?? 'Unassigned',
                    'cluster' => $emp->department?->cluster?->name ?? '—',
                    'time_in' => $attTime,
                ]);
            } elseif ($isPast) {
                $absent->push([
                    'id' => $emp->id,
                    'employee_name' => $emp->full_name,
                    'department' => $emp->department?->name ?? 'Unassigned',
                    'cluster' => $emp->department?->cluster?->name ?? '—',
                ]);
            }
        }

        // Build a simplified list for the manual attendance modal (searchable)
        $requiredEmployeesList = $requiredEmployees->map(function ($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->full_name,
                'department' => $emp->department?->name ?? 'Unassigned',
                'cluster' => $emp->department?->cluster?->name ?? '—',
            ];
        })->values();

        $clusters = Cluster::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'cluster_id')->get();

        return Inertia::render('HR/Events/Attendance', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->date,
                'time' => $event->time,
                'venue' => $event->venue,
                'attendance_mode' => $event->attendance_mode,
            ],
            'summary' => [
                'total_required' => $requiredEmployees->count(),
                'total_present' => $present->count(),
                'total_absent' => $absent->count(),
            ],
            'present' => $present->values(),
            'absent' => $absent->values(),
            'requiredEmployees' => $requiredEmployeesList, // <-- Added for manual attendance
            'clusters' => $clusters,
            'departments' => $departments,
            'isPast' => $isPast,
        ]);
    }



}
