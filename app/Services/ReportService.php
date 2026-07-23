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
    public function getAttendanceByEvent(int $eventId, array $filters = []): array
    {
        $query = Attendance::with(['employee.department.cluster', 'event'])
            ->where('event_id', $eventId);

        // Apply cluster filter
        if (!empty($filters['cluster_id'])) {
            $query->whereHas('employee.department', function ($q) use ($filters) {
                $q->where('cluster_id', $filters['cluster_id']);
            });
        }

        // Apply department filter
        if (!empty($filters['department_id'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }

        $attendances = $query->get();
        $event = Event::find($eventId);

        $formattedAttendances = $attendances->map(function ($attendance) {
            return [
                'employee_name' => $attendance->employee->full_name,
                'department' => $attendance->employee->department?->name ?? 'Unassigned',
                'cluster' => $attendance->employee->department?->cluster?->name ?? '—',
                'time_in' => $attendance->time_in,
            ];
        });

        return [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->date,
                'time' => $event->time,
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
}
