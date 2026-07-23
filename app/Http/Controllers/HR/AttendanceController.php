<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;

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
        'time_in' => ['nullable', 'date_format:Y-m-d H:i:s'],
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


}
