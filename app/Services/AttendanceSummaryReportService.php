<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Event;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AttendanceSummaryReportService
{
    /**
     * Generate PDF with filters.
     */
    public function generatePdf(array $filters = [])
    {
        $data = $this->buildReportData($filters);

        $pdf = app('dompdf.wrapper')
            ->loadView('pdf.attendance-summary', $data)
            ->setPaper('a4', 'landscape')
            ->setOptions(['defaultFont' => 'sans-serif']);

        $filename = 'attendance_summary_' . now()->format('Y-m-d') . '.pdf';

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'private, max-age=0, must-revalidate',
        ]);
    }

    /**
     * Build report data with filters.
     */
    private function buildReportData(array $filters = []): array
    {
        $eventIds = $filters['event_ids'] ?? [];
        $clusterId = $filters['cluster_id'] ?? null;
        $departmentId = $filters['department_id'] ?? null;
        $dateFrom = $filters['date_from'] ?? null;
        $dateTo = $filters['date_to'] ?? null;

        // Query events
        $eventsQuery = Event::orderBy('date');

        if (!empty($eventIds)) {
            $eventsQuery->whereIn('id', $eventIds);
        }

        if ($dateFrom) {
            $eventsQuery->whereDate('date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $eventsQuery->whereDate('date', '<=', $dateTo);
        }

        $events = $eventsQuery->get(['id', 'title', 'date', 'time']);

        // Query employees
        $employeesQuery = Employee::with('department.cluster')
            ->orderBy('department_id')
            ->orderBy('last_name');

        if ($clusterId) {
            $employeesQuery->whereHas('department', function ($q) use ($clusterId) {
                $q->where('cluster_id', $clusterId);
            });
        }

        if ($departmentId) {
            $employeesQuery->where('department_id', $departmentId);
        }

        $employees = $employeesQuery->get();

        // Fetch all attendances for these events and employees
        $eventIds = $events->pluck('id')->toArray();
        $employeeIds = $employees->pluck('id')->toArray();

        $attendances = Attendance::whereIn('event_id', $eventIds)
            ->whereIn('employee_id', $employeeIds)
            ->get(['employee_id', 'event_id', 'time_in', 'status']);

        // Group by employee_id
        $attendanceGrouped = $attendances->groupBy('employee_id');

        $report = [];

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
                'late_count' => 0,
            ];

            $empAttendances = $attendanceGrouped->get($employee->id, collect())->keyBy('event_id');

            foreach ($events as $event) {
                $attendance = $empAttendances->get($event->id);

                if ($attendance) {
                    // Determine status: present or late
                    $status = $attendance->status ?? 'present'; // fallback
                    $employeeData['events'][] = [
                        'event_id' => $event->id,
                        'present' => ($status === 'present'), // for attendance count
                        'status' => $status, // 'present' or 'late'
                        'time_in' => $attendance->time_in,
                    ];
                    if ($status === 'present') {
                        $employeeData['attended_count']++;
                    } else {
                        $employeeData['late_count']++;
                    }
                } else {
                    $employeeData['events'][] = [
                        'event_id' => $event->id,
                        'present' => false,
                        'status' => 'absent',
                        'time_in' => null,
                    ];
                }
            }

            $report[$deptName]['employees'][] = $employeeData;
        }

        // Sort employees by name within each department
        foreach ($report as $dept => &$data) {
            $data['employees'] = collect($data['employees'])->sortBy('name')->values()->toArray();
        }

        // Add filter summary
        $filterSummary = [];
        if ($dateFrom) $filterSummary[] = 'From ' . Carbon::parse($dateFrom)->format('M d, Y');
        if ($dateTo) $filterSummary[] = 'To ' . Carbon::parse($dateTo)->format('M d, Y');
        if ($clusterId) {
            $cluster = \App\Models\Cluster::find($clusterId);
            if ($cluster) $filterSummary[] = 'Cluster: ' . $cluster->name;
        }
        if ($departmentId) {
            $dept = \App\Models\Department::find($departmentId);
            if ($dept) $filterSummary[] = 'Department: ' . $dept->name;
        }

        return [
            'events' => $events,
            'report' => $report,
            'generated_at' => now()->format('F d, Y h:i A'),
            'filters' => $filterSummary,
        ];
    }
}
