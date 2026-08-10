<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AttendanceExport;
use App\Services\AttendanceSummaryReportService;
use App\Models\Event;
use App\Models\Cluster;
use App\Models\Department;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Show the attendance report page.
     */
    public function index()
    {
        $events = $this->reportService->getAllEvents();
        $clusters = Cluster::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'cluster_id')->get();

        return Inertia::render('HR/Reports/EventAttendance', [
            'events' => $events,
            'clusters' => $clusters,
            'departments' => $departments,
        ]);
    }

    /**
     * Fetch attendance data for a specific event (API).
     */
    public function getEventAttendance(Request $request)
    {
        $request->validate([
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'cluster_id' => ['nullable', 'integer', 'exists:clusters,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
        ]);

        $filters = $request->only(['cluster_id', 'department_id']);
        $data = $this->reportService->getAttendanceByEvent($request->event_id, $filters);
        return response()->json($data);
    }

    /**
     * Export attendance for a specific event.
     */
   public function export(Request $request)
{
    $request->validate([
        'event_id' => ['required', 'integer', 'exists:events,id'],
        'format'   => ['required', 'in:csv,xlsx'],
        'cluster_id'   => ['nullable', 'integer', 'exists:clusters,id'],
        'department_id'=> ['nullable', 'integer', 'exists:departments,id'],
    ]);

    $filters = $request->only(['cluster_id', 'department_id']);

    // Use the new method that includes all required employees with status
    $data = $this->reportService->getFullAttendanceForEvent($request->event_id, $filters);
    $attendances = $data['attendances']; // array with status

    $event = Event::findOrFail($request->event_id);
    $filename = 'attendance_' . $event->title . '_' . $event->date . '.' . $request->format;

    return Excel::download(new AttendanceExport($attendances), $filename);
}




public function attendanceSummaryPdf(Request $request, AttendanceSummaryReportService $service)
{
    $filters = $request->only(['event_ids', 'cluster_id', 'department_id', 'date_from', 'date_to']);

    // Convert comma-separated event_ids to array
    if (isset($filters['event_ids']) && is_string($filters['event_ids'])) {
        $filters['event_ids'] = array_filter(explode(',', $filters['event_ids']));
    }

    return $service->generatePdf($filters);
}

}
