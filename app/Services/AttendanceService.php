<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Event;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\UniqueConstraintViolationException;
use Carbon\Carbon;

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

            $eventData = $this->getEventData($eventId);
            if (!$eventData) {
                return ['success' => false, 'message' => 'Event not found', 'data' => null];
            }

            // ---- ENFORCE EVENT STATUS AND START TIME ----
            if ($eventData['status'] !== 'ongoing') {
                return [
                    'success' => false,
                    'message' => 'There is no active or ongoing event available for attendance scanning.',
                    'data' => null
                ];
            }

            $startDateTime = Carbon::parse($eventData['date'] . ' ' . $eventData['time']);
            if (now()->lt($startDateTime)) {
                return [
                    'success' => false,
                    'message' => 'There is no active or ongoing event available for attendance scanning.',
                    'data' => null
                ];
            }
            // ---- END VALIDATION ----

            // Check if employee is required for this event (if not "all_employees")
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

            // Attempt to create attendance record
            try {
                // Compute attendance status based on grace period
                $gracePeriod = $eventData['grace_period'] ?? 0;
                if ($gracePeriod > 0) {
                    $deadline = Carbon::parse($eventData['time'])->addMinutes($gracePeriod);
                    $status = now()->lte($deadline) ? 'present' : 'late';
                } else {
                    $status = 'present';
                }

                $attendance = DB::transaction(function () use ($employee, $eventId, $status) {
                    return Attendance::create([
                        'employee_id' => $employee->id,
                        'event_id' => $eventId,
                        'time_in' => now(),
                        'status' => $status,
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
                        'profile_photo' => $employee->profile_photo_url,
                        'status' => $status,
                    ],
                ];
            } catch (UniqueConstraintViolationException $e) {
                // Already checked in – fetch existing record
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
                        'profile_photo' => $employee->profile_photo_url,
                        'status' => $existing->status,
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
            'time' => $event->time,
            'date' => $event->date,          // ✅ added
            'grace_period' => $event->grace_period,
            'status' => $event->status,      // ✅ added
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
    Log::info('manualAttendance START', [
        'employee_id' => $employeeId,
        'event_id' => $eventId,
        'user_id' => $userId,
        'remarks' => $remarks,
        'timeIn' => $timeIn,
    ]);

    try {
        Log::info('Fetching employee...');
        $employee = Employee::find($employeeId);
        if (!$employee) {
            Log::warning('Employee not found', ['employee_id' => $employeeId]);
            return ['success' => false, 'message' => 'Employee not found.', 'data' => null];
        }

        Log::info('Fetching event...');
        $event = Event::with('requiredEmployees')->find($eventId);
        if (!$event) {
            Log::warning('Event not found', ['event_id' => $eventId]);
            return ['success' => false, 'message' => 'Event not found.', 'data' => null];
        }

        Log::info('Event found', [
            'event_id' => $event->id,
            'attendance_mode' => $event->attendance_mode,
            'title' => $event->title,
        ]);

        if ($event->attendance_mode !== 'all_employees') {
            Log::info('Checking if employee is required...');
            $isRequired = $event->requiredEmployees()->where('employee_id', $employeeId)->exists();
            if (!$isRequired) {
                Log::warning('Employee not required for event', [
                    'employee_id' => $employeeId,
                    'event_id' => $eventId,
                ]);
                return ['success' => false, 'message' => 'This employee is not assigned to this event.', 'data' => null];
            }
        }

        Log::info('Checking for existing attendance...');
        $existing = Attendance::where('employee_id', $employeeId)
            ->where('event_id', $eventId)
            ->first();
        if ($existing) {
            Log::info('Existing attendance found', ['attendance_id' => $existing->id]);
            return [
                'success' => false,
                'message' => 'Already Checked In',
                'data' => [
                    'employee_name' => $employee->full_name,
                    'department' => $employee->department?->name ?? 'Unassigned',
                    'time_in' => $existing->time_in,
                    'event_title' => $event->title,
                    'status' => $existing->status,
                ],
            ];
        }

        $checkTime = $timeIn ? Carbon::parse($timeIn) : now();
        Log::info('Check time computed', ['checkTime' => $checkTime->toDateTimeString()]);

        $gracePeriod = $event->grace_period ?? 0;
        if ($gracePeriod > 0) {
            $deadline = Carbon::parse($event->time)->addMinutes($gracePeriod);
            $status = $checkTime->lte($deadline) ? 'present' : 'late';
        } else {
            $status = 'present';
        }
        Log::info('Status computed', ['status' => $status]);

        Log::info('Starting transaction to create attendance...');
        $attendance = DB::transaction(function () use ($employeeId, $eventId, $userId, $remarks, $checkTime, $status) {
            Log::info('Inside transaction, creating attendance...');
            return Attendance::create([
                'employee_id' => $employeeId,
                'event_id' => $eventId,
                'time_in' => $checkTime,
                'is_manual' => true,
                'recorded_by' => $userId,
                'remarks' => $remarks,
                'status' => $status,
            ]);
        });

        Log::info('Attendance created successfully', ['attendance_id' => $attendance->id]);

        return [
            'success' => true,
            'message' => 'Attendance recorded successfully.',
            'data' => [
                'employee_name' => $employee->full_name,
                'department' => $employee->department?->name ?? 'Unassigned',
                'time_in' => $attendance->time_in,
                'event_title' => $event->title,
                'status' => $status,
            ],
        ];
    } catch (\Exception $e) {
        Log::error('Manual attendance error: ' . $e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString(),
        ]);
        return ['success' => false, 'message' => 'An error occurred: ' . $e->getMessage(), 'data' => null];
    }
}



}
