<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\Event;
use Carbon\Carbon;


class DashboardController extends Controller
{
   public function index(Request $request)
{
    $user = $request->user();
    $employee = $user->employee;

    if (!$employee) {
        // ✅ Redirect to home or login with a clear message
        return redirect()->route('home')->with('error', 'Your employee record was not found. Please contact HR.');
    }

    $employee->load('department.cluster');

        // Total events attended
        $totalEvents = $employee->attendances()->count();

        // Upcoming events (next 5)
        $upcomingEvents = Event::where('status', 'upcoming')
            ->where('date', '>=', Carbon::today())
            ->orderBy('date')
            ->limit(5)
            ->get(['id', 'title', 'date', 'time', 'venue']);

        // Attendance history (last 10)
        $attendanceHistory = $employee->attendances()
            ->with('event')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($attendance) {
                return [
                    'event_title' => $attendance->event->title,
                    'event_date' => $attendance->event->date,
                    'venue' => $attendance->event->venue,
                    'time_in' => $attendance->time_in,
                ];
            });

        // ✅ Generate QR code as base64 SVG (with margin)
        $qrCode = QrCode::size(300)
            ->margin(3)   // <-- ADD THIS (if not already)
            ->generate($employee->qr_token);
        $qrBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCode);

        $totalEventsAll = Event::count();
        $attendanceRate = $totalEventsAll > 0 ? round(($totalEvents / $totalEventsAll) * 100, 1) : 0;

        return Inertia::render('Employee/Dashboard', [
            'employee' => [
                'full_name' => $employee->full_name,
                'formatted_name' => $employee->formatted_name,
                'department' => $employee->department?->name ?? 'Unassigned',
                'cluster' => $employee->department?->cluster?->name ?? '—',
                'username' => $user->username,
                'qr_token' => $employee->qr_token,
                'theme' => $user->theme ?? 'navy',
                'profile_photo_url' => $employee->profile_photo_url, // ✅ add this
            ],
            'stats' => [
                'total_events' => $totalEvents,
                'upcoming_events' => $upcomingEvents->count(),
                'attendance_rate' => $attendanceRate,
            ],
            'attendanceHistory' => $attendanceHistory,
            'qrCodeData' => $qrBase64,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
