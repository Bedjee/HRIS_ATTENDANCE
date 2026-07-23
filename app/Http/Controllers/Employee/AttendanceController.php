<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        // Build query
        $query = $employee->attendances()
            ->with('event')
            ->orderBy('time_in', 'desc');

        // Filters
        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->filled('month')) {
            $query->whereMonth('time_in', $request->month);
        }

        if ($request->filled('year')) {
            $query->whereYear('time_in', $request->year);
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('time_in', [$request->date_from, $request->date_to]);
        }

        // Search (event name or venue)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('event', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('venue', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'oldest':
                $query->orderBy('time_in', 'asc');
                break;
            case 'event_date_asc':
                $query->join('events', 'attendances.event_id', '=', 'events.id')
                      ->orderBy('events.date', 'asc')
                      ->select('attendances.*');
                break;
            case 'event_date_desc':
                $query->join('events', 'attendances.event_id', '=', 'events.id')
                      ->orderBy('events.date', 'desc')
                      ->select('attendances.*');
                break;
            default: // newest
                $query->orderBy('time_in', 'desc');
                break;
        }

        // Paginate
        $attendances = $query->paginate(10);

        // Format the data
        $formattedAttendances = $attendances->map(function ($attendance) {
            return [
                'id' => $attendance->id,
                'event_title' => $attendance->event->title,
                'event_date' => $attendance->event->date,
                'venue' => $attendance->event->venue,
                'time_in' => $attendance->time_in,
            ];
        });

        // Get list of events the employee attended (for filter dropdown)
        $eventsAttended = $employee->attendances()
            ->with('event')
            ->get()
            ->pluck('event')
            ->unique('id')
            ->values()
            ->map(function ($event) {
                return ['id' => $event->id, 'title' => $event->title];
            });

        // Summary
        $totalAttendances = $employee->attendances()->count();
        $totalEventsAttended = $employee->attendances()->distinct('event_id')->count();
        $mostRecent = $employee->attendances()->latest()->first();

        return Inertia::render('Employee/Attendance/Index', [
            'attendances' => $attendances->setCollection($formattedAttendances),
            'filters' => $request->only(['event_id', 'month', 'year', 'search', 'sort', 'date_from', 'date_to']),
            'eventsAttended' => $eventsAttended,
            'summary' => [
                'total_attendances' => $totalAttendances,
                'total_events' => $totalEventsAttended,
                'most_recent' => $mostRecent ? [
                    'event_title' => $mostRecent->event->title,
                    'time_in' => $mostRecent->time_in,
                ] : null,
            ],
            'months' => collect(range(1, 12))->mapWithKeys(function ($m) {
                return [$m => Carbon::createFromFormat('m', $m)->format('F')];
            }),
            'years' => range(2020, Carbon::now()->year),
        ]);
    }
}
