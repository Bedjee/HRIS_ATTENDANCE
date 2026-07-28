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
        // Permission check: employee can view their own; HR can view any
        $user = $request->user();
        $employee = Employee::findOrFail($employeeId);

        if ($user->id !== $employee->user_id && !$user->isHr()) {
            abort(403, 'Unauthorized.');
        }

        $path = 'employee_photos/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        return Storage::disk('public')->response($path);
    }
}
