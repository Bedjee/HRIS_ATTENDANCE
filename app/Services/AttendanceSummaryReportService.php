<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Event;
use App\Models\Attendance;

class AttendanceSummaryReportService
{
    /**
     * Generate and return the PDF as a downloadable response.
     */
    public function generatePdf()
    {
        $data = $this->buildReportData();

        $pdf = app('dompdf.wrapper')
            ->loadView('pdf.attendance-summary', $data)
            ->setPaper('a4', 'landscape')
            ->setOptions(['defaultFont' => 'sans-serif']);

        // Get raw PDF output and send as file download with explicit headers
        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="attendance_summary_' . now()->format('Y-m-d') . '.pdf"',
            'Cache-Control' => 'private, max-age=0, must-revalidate',
        ]);
    }

    /**
     * Build the report data.
     */
    private function buildReportData(): array
    {
        $events = Event::where('attendance_mode', 'all_employees')
            ->orderBy('date')
            ->get(['id', 'title', 'date']);

        $employees = Employee::with('department')
            ->orderBy('department_id')
            ->get();

        $report = [];
        $eventIds = $events->pluck('id')->toArray();
        $attendances = Attendance::whereIn('event_id', $eventIds)
            ->get(['employee_id', 'event_id', 'time_in'])
            ->groupBy('employee_id');

        foreach ($employees as $employee) {
            $deptName = $employee->department?->name ?? 'Unassigned';
            if (!isset($report[$deptName])) {
                $report[$deptName] = ['employees' => []];
            }

            $employeeData = [
                'id' => $employee->id,
                'name' => $employee->full_name,
                'events' => [],
                'attended_count' => 0,
            ];

            foreach ($events as $event) {
                $attended = $attendances->has($employee->id) &&
                            $attendances[$employee->id]->contains('event_id', $event->id);
                $employeeData['events'][] = [
                    'event_id' => $event->id,
                    'present' => $attended,
                ];
                if ($attended) {
                    $employeeData['attended_count']++;
                }
            }

            $report[$deptName]['employees'][] = $employeeData;
        }

        foreach ($report as $dept => &$data) {
            $data['employees'] = collect($data['employees'])->sortBy('name')->values()->toArray();
        }

        return [
            'events' => $events,
            'report' => $report,
            'generated_at' => now()->format('F d, Y h:i A'),
        ];
    }
}
