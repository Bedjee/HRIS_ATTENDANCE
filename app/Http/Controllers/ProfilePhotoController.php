<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProfilePhotoController extends Controller
{
    public function show(Request $request, $employeeId, $filename)
{
    $user = $request->user();
    $employee = Employee::findOrFail($employeeId);

    if ($user->id !== $employee->user_id && !$user->isHr()) {
        abort(403, 'Unauthorized.');
    }

    // Get the stored path from the employee record
    $storedPath = $employee->profile_photo;
    if (!$storedPath) {
        abort(404);
    }

    // Ensure the filename matches the stored path's basename
    if (basename($storedPath) !== $filename) {
        abort(404);
    }

    if (!Storage::disk('public')->exists($storedPath)) {
        abort(404);
    }

    return Storage::disk('public')->response($storedPath);
}


}


