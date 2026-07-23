<?php

use App\Http\Controllers\PasswordChangeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HR\EmployeeImportController;
use App\Http\Controllers\Employee\DashboardController as EmployeeDashboardController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\HR\DashboardController as HRDashboardController;
use App\Http\Controllers\HR\EmployeeController;
use App\Http\Controllers\HR\AttendanceController;
use App\Http\Controllers\HR\EventController;
use App\Http\Controllers\HR\ReportController;
use App\Http\Controllers\HR\ClusterController;
use App\Http\Controllers\Employee\AttendanceController as EmployeeAttendanceController;
use App\Http\Controllers\HR\UserController;

use App\Http\Controllers\HR\AnalyticsController;
use App\Http\Controllers\HR\DepartmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



// ✅ PDF route – outside Inertia group
Route::get('/hr/reports/attendance-summary-pdf', [ReportController::class, 'attendanceSummaryPdf'])
    ->name('hr.reports.attendance-summary-pdf')
    ->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class])
    ->middleware(['auth', 'must.change.password', 'role:hr']);


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});




// Password change routes – accessible even if must_change_password is true
Route::middleware(['auth'])->group(function () {
    Route::get('/change-password', [PasswordChangeController::class, 'showChangeForm'])
        ->name('password.change');
    Route::post('/change-password', [PasswordChangeController::class, 'update'])
        ->name('password.update');
});


Route::middleware(['auth', 'must.change.password', 'role:employee'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'updateEmployee'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Employee Attendance
Route::get('/employee/attendance', [EmployeeAttendanceController::class, 'index'])
    ->name('employee.attendance')
    ->middleware('role:employee');
});


// All other authenticated routes require that the password has been changed
Route::middleware(['auth', 'must.change.password'])->group(function () {
    // HR Dashboard
   Route::get('/hr/dashboard', [HRDashboardController::class, 'index'])->name('hr.dashboard');

    // Employee Dashboard (only one definition)
    Route::get('/employee/dashboard', [EmployeeDashboardController::class, 'index'])
        ->name('employee.dashboard')
        ->middleware('role:employee');


        // Employee QR Code (image)
Route::get('/employee/qr-code-image', [QRCodeController::class, 'show'])
    ->name('employee.qr.image')
    ->middleware('role:employee');

// Employee QR Code page
Route::get('/employee/qr', function () {
    return Inertia::render('Employee/QR');
})->name('employee.qr')->middleware('role:employee');

Route::get('/employee/qr', [QRCodeController::class, 'page'])
    ->name('employee.qr')
    ->middleware('role:employee');





    Route::prefix('hr')->middleware('role:hr')->group(function () {
    // Employee Import
    Route::get('/employees/import', [EmployeeImportController::class, 'index'])->name('hr.employees.import');
    Route::post('/employees/import/preview', [EmployeeImportController::class, 'preview'])->name('hr.employees.import.preview');
    Route::post('/employees/import/confirm', [EmployeeImportController::class, 'confirm'])->name('hr.employees.import.confirm');


    // Employee Management
Route::get('/employees', [EmployeeController::class, 'index'])->name('hr.employees.index');
Route::post('/employees/{employee}/reset-password', [EmployeeController::class, 'resetPassword'])
    ->name('hr.employees.reset-password');
Route::get('/employees/{employee}/qr', [EmployeeController::class, 'showQr'])
    ->name('hr.employees.qr');

    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('hr.employees.create');
Route::post('/employees', [EmployeeController::class, 'store'])->name('hr.employees.store');

    // Events
    Route::get('/events', [EventController::class, 'index'])->name('hr.events.index');
    Route::get('/events/create', [EventController::class, 'create'])->name('hr.events.create');
    Route::post('/events', [EventController::class, 'store'])->name('hr.events.store');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('hr.events.edit');
    Route::patch('/events/{event}', [EventController::class, 'update'])->name('hr.events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('hr.events.destroy');

    Route::get('/events/{event}/attendance', [EventController::class, 'attendance'])->name('hr.events.attendance');
    Route::get('/events/{event}/required', [EventController::class, 'required'])->name('hr.events.required');

    // Attendance Scanning
    Route::get('/attendance/scan', [AttendanceController::class, 'scan'])->name('hr.attendance.scan');
    Route::post('/attendance/scan/process', [AttendanceController::class, 'processScan'])->name('hr.attendance.scan.process');


    // Reports
Route::get('/reports/attendance', [ReportController::class, 'index'])->name('hr.reports.index');
Route::get('/reports/attendance/data', [ReportController::class, 'getEventAttendance'])->name('hr.reports.get-attendance');
Route::get('/reports/attendance/export', [ReportController::class, 'export'])->name('hr.reports.export');



Route::get('/analytics', [AnalyticsController::class, 'index'])->name('hr.analytics');


 Route::resource('clusters', ClusterController::class)->except(['show'])->names('hr.clusters');
    Route::resource('departments', DepartmentController::class)->except(['show'])->names('hr.departments');

    Route::post('/events/{event}/manual-attendance', [AttendanceController::class, 'manualStore'])
    ->name('hr.events.manual-attendance');

    Route::resource('users', UserController::class)->except(['show'])->names('hr.users');
Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('hr.users.reset-password');


});





});

// Redirect /dashboard to role-based dashboard
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->isHr()) {
        return redirect()->route('hr.dashboard');
    }
    return redirect()->route('employee.dashboard');
})->middleware(['auth', 'must.change.password'])->name('dashboard');



require __DIR__.'/auth.php';
