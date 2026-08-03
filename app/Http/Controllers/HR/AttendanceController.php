<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
use App\Models\Attendance;
use App\Models\AttendanceStatusChange;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    /**
     * Show the scan attendance page.
     */
    public function scan(Request $request)
    {
        // Get all events for dropdown selection
        $events = \App\Models\Event::orderBy('date', 'desc')->get(['id', 'title', 'date', 'time', 'venue']);

        return Inertia::render('HR/Attendance/Scan', [
            'events' => $events,
            'selectedEventId' => $request->query('event_id') ?? null,
        ]);
    }

    /**
     * API endpoint to process a QR scan.
     */
   public function processScan(Request $request)
{
    Log::info('Attendance scan request received', $request->all());

    try {
        $validated = $request->validate([
            'qr_token' => ['required', 'string', 'max:255'],
            'event_id' => ['required', 'integer', 'exists:events,id'],
        ]);

        Log::info('Validated data:', $validated);

        $result = $this->attendanceService->scanAttendance(
            $validated['qr_token'],
            $validated['event_id']
        );

        Log::info('Scan result:', $result);

        return response()->json($result);
    } catch (\Exception $e) {
        Log::error('Scan exception: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Server error: ' . $e->getMessage(),
        ], 500);
    }
}


public function manualStore(Request $request, Event $event)
{
    Log::info('Manual attendance request', $request->all());

    $request->validate([
        'employee_id' => ['required', 'integer', 'exists:employees,id'],
        'remarks' => ['required', 'string', 'max:500'],
        'time_in' => ['nullable', 'date_format:Y-m-d\TH:i'], // ✅ changed to match datetime-local format
    ]);

    $result = $this->attendanceService->manualAttendance(
        $request->employee_id,
        $event->id,
        $request->user()->id,
        $request->remarks,
        $request->time_in
    );

    Log::info('Manual attendance result', $result);

    return response()->json($result);
}


public function updateStatus(Request $request, Attendance $attendance)
{
    Log::info('Status update request', [
        'attendance_id' => $attendance->id,
        'payload' => $request->all(),
    ]);

    try {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['present', 'late', 'absent'])],
            'reason' => ['required', 'string', 'min:3', 'max:500'],
        ]);

        $oldStatus = $attendance->status;
        $newStatus = $validated['status'];

        if ($oldStatus === $newStatus) {
            return response()->json([
                'success' => false,
                'message' => 'Status is already set to ' . $newStatus . '.',
            ], 422);
        }

        $attendance->status = $newStatus;
        $attendance->save();

        AttendanceStatusChange::create([
            'attendance_id' => $attendance->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => $request->user()->id,
            'reason' => $validated['reason'],
        ]);

        Cache::forget("event_{$attendance->event_id}_meta");

        return response()->json([
            'success' => true,
            'message' => 'Attendance status updated successfully.',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed.',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        Log::error('Status update error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Server error: ' . $e->getMessage(),
        ], 500);
    }
}


}
