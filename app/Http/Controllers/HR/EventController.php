<?php

namespace App\Http\Controllers\HR;
use App\Models\Attendance;
use App\Models\Cluster;
use App\Models\Department;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Services\EventService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
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

        $event = $this->eventService->updateEvent($id, $data);

        // Clear the cached event metadata
        Cache::forget("event_{$event->id}_meta");

        return redirect()->route('hr.events.index')
            ->with('success', 'Event updated successfully.');
    } catch (\Exception $e) {
        return back()->with('error', 'Failed to update event: ' . $e->getMessage());
    }
}



// app/Http/Controllers/HR/EventController.php

public function destroy($id)
{
    Log::info('Destroy controller called for event: ' . $id);

    try {
        $this->eventService->deleteEvent($id);
        return redirect()->route('hr.events.index')
            ->with('success', 'Event deleted successfully.');
    } catch (\Exception $e) {
        Log::error('Delete failed: ' . $e->getMessage());
        return back()->with('error', $e->getMessage());
    }
}



public function updateStatus(Request $request, Event $event)
{
    $request->validate([
        'status' => ['required', Rule::in(['upcoming', 'ongoing', 'completed'])],
    ]);

    $event->status = $request->status;
    $event->save();

    // Clear the cached event metadata
    Cache::forget("event_{$event->id}_meta");

    return redirect()->route('hr.events.index')
        ->with('success', 'Status updated successfully.');
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
    // Get all employees required for this event
    $requiredEmployees = $event->requiredEmployees()
        ->with(['department.cluster', 'user'])
        ->get();

    // Map employee_id => time_in from already recorded attendance
    $presentRecords = Attendance::where('event_id', $event->id)
        ->pluck('time_in', 'employee_id');

    $eventDate = Carbon::parse($event->date . ' ' . $event->time);
    $isPast = $eventDate->isPast();

    $present = collect();
    $absent = collect();
    $late = collect();

    foreach ($requiredEmployees as $emp) {
        $attTime = $presentRecords->get($emp->id);

        if ($attTime) {
            // Fetch the actual attendance record to get its ID and status
            $attendance = Attendance::where('employee_id', $emp->id)
                ->where('event_id', $event->id)
                ->first();

            $status = $attendance->status; // 'present', 'late', or 'absent'

            // Common data
            $attData = [
                'id' => $attendance->id,
                'employee_name' => $emp->full_name,
                'department' => $emp->department?->name ?? 'Unassigned',
                'cluster' => $emp->department?->cluster?->name ?? '—',
                'time_in' => $attTime,
                'status' => $status,
            ];

            // Categorize based on the actual status
            if ($status === 'late') {
                $late->push($attData);
            } elseif ($status === 'absent') {
                $absent->push($attData);
            } else {
                // 'present' or any other status (treat as present)
                $present->push($attData);
            }
        } elseif ($isPast) {
            // No attendance record yet and event is past → mark as absent
            $absent->push([
                'id' => null,
                'employee_id' => $emp->id,
                'employee_name' => $emp->full_name,
                'department' => $emp->department?->name ?? 'Unassigned',
                'cluster' => $emp->department?->cluster?->name ?? '—',
                'status' => 'absent',
            ]);
        }
        // If event is not past and no record, the employee is not yet categorized
    }

    // Build required employees list for manual attendance modal
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
            'grace_period' => $event->grace_period,
        ],
        'summary' => [
            'total_required' => $requiredEmployees->count(),
            'total_present' => $present->count(),
            'total_absent' => $absent->count(),
            'total_late' => $late->count(),
        ],
        'present' => $present->values(),
        'absent' => $absent->values(),
        'late' => $late->values(),
        'requiredEmployees' => $requiredEmployeesList,
        'clusters' => $clusters,
        'departments' => $departments,
        'isPast' => $isPast,
    ]);
}




}
