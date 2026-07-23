<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use  Inertia\Inertia;


class QRCodeController extends Controller
{
    /**
     * Generate and return QR code image for the authenticated employee.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        if (!$employee) {
            abort(404, 'Employee record not found.');
        }

        $qrCode = QrCode::size(300)
            ->format('png')
            ->generate($employee->qr_token);

        return response($qrCode)
            ->header('Content-Type', 'image/png');
    }

    /**
     * Generate QR code for a specific employee (HR only).
     */
    public function showForEmployee(Request $request, Employee $employee)
    {
        // Ensure HR role
        if (!$request->user()->isHr()) {
            abort(403);
        }

        $qrCode = QrCode::size(300)
            ->format('png')
            ->generate($employee->qr_token);

        return response($qrCode)
            ->header('Content-Type', 'image/png');
    }


    public function page(Request $request)
{
    $user = $request->user();
    $employee = $user->employee;

    if (!$employee) {
        abort(404, 'Employee record not found.');
    }

    // Generate QR as base64 (same as dashboard)
    $qrCode = QrCode::size(300)->generate($employee->qr_token);
    $qrBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCode);

    return Inertia::render('Employee/QR', [
        'qrCodeData' => $qrBase64,
    ]);
}
}
