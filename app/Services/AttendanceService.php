<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Event;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\UniqueConstraintViolationException;

class AttendanceService
{
    /**
     * Scan attendance using QR token.
     */
    public function scanAttendance(string $qrToken, int $eventId): array
    {
        try {
            $employee = Employee::where('qr_token', $qrToken)->first();
            if (!$employee) {
                return ['success' => false, 'message' => 'Invalid QR Code', 'data' => null];
            }

            // ✅ Get event data as array (cached)
            $eventData = $this->getEventData($eventId);
            if (!$eventData) {
                return ['success' => false, 'message' => 'Event not found', 'data' => null];
            }

            // ✅ Required employee validation (cached)
            if ($eventData['attendance_mode'] !== 'all_employees') {
                $requiredIds = $this->getRequiredEmployeeIds($eventId);
                if (!in_array($employee->id, $requiredIds)) {
                    Log::warning('Unauthorized attendance attempt', [
                        'employee_id' => $employee->id,
                        'event_id' => $eventId,
                    ]);
                    return [
                        'success' => false,
                        'message' => 'This employee is not assigned to this event.',
                        'data' => null,
                    ];
                }
            }

            // ✅ Attempt to insert (unique constraint prevents duplicates)
            try {
                $attendance = DB::transaction(function () use ($employee, $eventId) {
                    return Attendance::create([
                        'employee_id' => $employee->id,
                        'event_id' => $eventId,
                        'time_in' => now(),
                    ]);
                });

                return [
                    'success' => true,
                    'message' => 'Attendance Recorded Successfully',
                    'data' => [
                        'employee_name' => $employee->full_name,
                        'department' => $employee->department?->name ?? 'Unassigned',
                        'time_in' => $attendance->time_in,
                        'event_title' => $eventData['title'],
                    ],
                ];
            } catch (UniqueConstraintViolationException $e) {
                $existing = Attendance::where('employee_id', $employee->id)
                    ->where('event_id', $eventId)
                    ->first();

                return [
                    'success' => false,
                    'message' => 'Already Checked In',
                    'data' => [
                        'employee_name' => $employee->full_name,
                        'department' => $employee->department?->name ?? 'Unassigned',
                        'time_in' => $existing->time_in,
                        'event_title' => $eventData['title'],
                    ],
                ];
            }
        } catch (\Exception $e) {
            Log::error('Attendance scan error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred.', 'data' => null];
        }
    }

    /**
     * Get event data as array (cached for 10 minutes).
     */
    private function getEventData(int $eventId): ?array
    {
        return Cache::remember("event_{$eventId}_meta", 600, function () use ($eventId) {
            $event = Event::find($eventId);
            if (!$event) {
                return null;
            }
            return [
                'id' => $event->id,
                'title' => $event->title,
                'attendance_mode' => $event->attendance_mode,
                'selected_clusters' => $event->selected_clusters,
                'selected_departments' => $event->selected_departments,
            ];
        });
    }

    /**
     * Get required employee IDs for an event (cached for 5 minutes).
     */
    private function getRequiredEmployeeIds(int $eventId): array
    {
        return Cache::remember("event_{$eventId}_required", 300, function () use ($eventId) {
            return Event::find($eventId)
                ->requiredEmployees()
                ->pluck('employee_id')
                ->toArray();
        });
    }

    /**
     * Record manual attendance.
     */
    public function manualAttendance(int $employeeId, int $eventId, int $userId, string $remarks, ?string $timeIn = null): array
    {
        try {
            $employee = Employee::find($employeeId);
            if (!$employee) {
                return ['success' => false, 'message' => 'Employee not found.', 'data' => null];
            }

            $event = Event::with('requiredEmployees')->find($eventId);
            if (!$event) {
                return ['success' => false, 'message' => 'Event not found.', 'data' => null];
            }

            if ($event->attendance_mode !== 'all_employees') {
                $isRequired = $event->requiredEmployees()->where('employee_id', $employeeId)->exists();
                if (!$isRequired) {
                    return ['success' => false, 'message' => 'This employee is not assigned to this event.', 'data' => null];
                }
            }

            $existing = Attendance::where('employee_id', $employeeId)
                ->where('event_id', $eventId)
                ->first();
            if ($existing) {
                return [
                    'success' => false,
                    'message' => 'Already Checked In',
                    'data' => [
                        'employee_name' => $employee->full_name,
                        'department' => $employee->department?->name ?? 'Unassigned',
                        'time_in' => $existing->time_in,
                        'event_title' => $event->title,
                    ],
                ];
            }

            $attendance = DB::transaction(function () use ($employeeId, $eventId, $userId, $remarks, $timeIn) {
                return Attendance::create([
                    'employee_id' => $employeeId,
                    'event_id' => $eventId,
                    'time_in' => $timeIn ?? now(),
                    'is_manual' => true,
                    'recorded_by' => $userId,
                    'remarks' => $remarks,
                ]);
            });

            return [
                'success' => true,
                'message' => 'Attendance recorded successfully.',
                'data' => [
                    'employee_name' => $employee->full_name,
                    'department' => $employee->department?->name ?? 'Unassigned',
                    'time_in' => $attendance->time_in,
                    'event_title' => $event->title,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Manual attendance error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred.', 'data' => null];
        }
    }
}
