<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Event;
use Illuminate\Support\Collection;

class ReportService
{
    /**
     * Get attendance data for a specific event with optional filters.
     */
   /**
 * Get attendance data for a specific event with optional filters.
 * Returns ALL required employees with their status.
 */
public function getAttendanceByEvent(int $eventId, array $filters = []): array
{
    $event = Event::findOrFail($eventId);

    // Start with required employees for this event
    $query = $event->requiredEmployees()->with('department.cluster');

    // Apply cluster filter
    if (!empty($filters['cluster_id'])) {
        $query->whereHas('department', function ($q) use ($filters) {
            $q->where('cluster_id', $filters['cluster_id']);
        });
    }

    // Apply department filter
    if (!empty($filters['department_id'])) {
        $query->where('department_id', $filters['department_id']);
    }

    $requiredEmployees = $query->get();

    // Fetch attendance records for these employees
    $employeeIds = $requiredEmployees->pluck('id')->toArray();
    $attendances = Attendance::where('event_id', $eventId)
        ->whereIn('employee_id', $employeeIds)
        ->get()
        ->keyBy('employee_id');

    // Build the data array
    $formattedAttendances = $requiredEmployees->map(function ($emp) use ($attendances) {
        $att = $attendances->get($emp->id);
        return [
            'employee_name' => $emp->full_name,
            'department'    => $emp->department?->name ?? 'Unassigned',
            'cluster'       => $emp->department?->cluster?->name ?? '—',
            'time_in'       => $att ? $att->time_in : null,
            'status'        => $att ? $att->status : 'absent',
        ];
    })->values()->toArray();

    return [
        'event' => [
            'id'    => $event->id,
            'title' => $event->title,
            'date'  => $event->date,
            'time'  => $event->time,
            'venue' => $event->venue,
        ],
        'attendances' => $formattedAttendances,
    ];
}

    /**
     * Get all events for dropdown.
     */
    public function getAllEvents()
    {
        return Event::orderBy('date', 'desc')->get(['id', 'title', 'date']);
    }


    public function getFullAttendanceForEvent(int $eventId, array $filters = []): array
{
    $event = Event::with('requiredEmployees.department.cluster')->findOrFail($eventId);
    $requiredEmployees = $event->requiredEmployees;

    // Apply filters
    if (!empty($filters['cluster_id'])) {
        $requiredEmployees = $requiredEmployees->filter(function ($emp) use ($filters) {
            return $emp->department && $emp->department->cluster_id == $filters['cluster_id'];
        });
    }
    if (!empty($filters['department_id'])) {
        $requiredEmployees = $requiredEmployees->filter(function ($emp) use ($filters) {
            return $emp->department_id == $filters['department_id'];
        });
    }

    // Fetch attendance records for these employees
    $employeeIds = $requiredEmployees->pluck('id')->toArray();
    $attendances = Attendance::where('event_id', $eventId)
        ->whereIn('employee_id', $employeeIds)
        ->get()
        ->keyBy('employee_id');

    $data = $requiredEmployees->map(function ($emp) use ($attendances) {
        $att = $attendances->get($emp->id);
        return [
            'employee_name' => $emp->full_name,
            'department' => $emp->department?->name ?? 'Unassigned',
            'cluster' => $emp->department?->cluster?->name ?? '—',
            'time_in' => $att ? $att->time_in : null,
            'status' => $att ? $att->status : 'absent',
        ];
    })->sortBy(function ($row) {
        // Sort by status order: present, late, absent
        $order = ['present' => 0, 'late' => 1, 'absent' => 2];
        return $order[$row['status']] ?? 3;
    })->values()->toArray();

    return [
        'event' => [
            'id' => $event->id,
            'title' => $event->title,
            'date' => $event->date,
            'time' => $event->time,
            'venue' => $event->venue,
        ],
        'attendances' => $data,
    ];
}
}
