<?php

namespace App\Http\Controllers\HR;
use App\Exports\EmployeesExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Http\Requests\UpdateEmployeeRequest; // we'll create this
use App\Models\User;
use App\Models\Cluster;
use App\Models\Department;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEmployeeRequest;
use App\Services\EmployeeImportService;
use Illuminate\Support\Facades\Hash;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees with search.
     */
   public function index(Request $request)
{
    $search = $request->input('search', '');
    $clusterId = $request->input('cluster_id');
    $departmentId = $request->input('department_id');

    $employees = Employee::with(['user', 'department.cluster'])
        ->when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('username', 'like', "%{$search}%");
                  })
                  ->orWhereHas('department', function ($dq) use ($search) {
                      $dq->where('name', 'like', "%{$search}%");
                  });
            });
        })
        ->when($clusterId, function ($query) use ($clusterId) {
            $query->whereHas('department', function ($q) use ($clusterId) {
                $q->where('cluster_id', $clusterId);
            });
        })
        ->when($departmentId, function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
        })
        ->orderBy('last_name')
        ->paginate(10);

    $clusters = Cluster::select('id', 'name')->get();
    $departments = Department::select('id', 'name', 'cluster_id')->get();

    return Inertia::render('HR/Employees/Index', [
        'employees' => $employees,
        'clusters' => $clusters,
        'departments' => $departments,
        'filters' => [
            'search' => $search,
            'cluster_id' => $clusterId,
            'department_id' => $departmentId,
        ],
    ]);
}

    /**
     * Reset employee password to default.
     */
    public function resetPassword(Employee $employee)
    {
        $user = $employee->user;
        $user->password = Hash::make('password');
        $user->must_change_password = true;
        $user->save();

        return back()->with('success', 'Password reset to default (password).');
    }

    /**
     * Show the QR code for an employee (as a page or modal).
     */
    public function showQr(Employee $employee)
{
    // Generate QR code as base64 data URI
    $qrCode = QrCode::size(300)
    ->margin(3)
    ->generate($employee->qr_token);
    $qrBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCode);

    return Inertia::render('HR/Employees/ShowQr', [
        'employee' => $employee,
        'qrCodeData' => $qrBase64,
    ]);
}



public function create()
{
    $departments = Department::select('id', 'name', 'cluster_id')->get();
    return Inertia::render('HR/Employees/Create', [
        'departments' => $departments,
    ]);
}

public function store(StoreEmployeeRequest $request, EmployeeImportService $importService)
{
    try {
        $employee = $importService->createEmployeeFromData($request->validated());
        return redirect()->route('hr.employees.index')
            ->with('success', 'Employee created successfully.');
    } catch (\Exception $e) {
        return back()->with('error', 'Failed to create employee: ' . $e->getMessage());
    }
}


public function exportCredentials()
{
    return Excel::download(new EmployeesExport, 'employee_credentials.xlsx');
}




public function show(Employee $employee)
{
    $employee->load(['user', 'department.cluster']);

    return Inertia::render('HR/Employees/Show', [
        'employee' => $employee,
        'clusters' => Cluster::select('id', 'name')->get(),
        'departments' => Department::select('id', 'name', 'cluster_id')->get(),
    ]);
}

/**
 * Show the edit form for an employee.
 */
public function edit(Employee $employee)
{
    $employee->load(['user', 'department.cluster']);
    return Inertia::render('HR/Employees/Edit', [
        'employee' => $employee,
        'clusters' => Cluster::select('id', 'name')->get(),
        'departments' => Department::select('id', 'name', 'cluster_id')->get(),
    ]);
}

/**
 * Update the specified employee.
 */
public function update(UpdateEmployeeRequest $request, Employee $employee)
{
    $data = $request->validated();

    // Update employee fields
    $employee->update([
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'middle_initial' => $data['middle_initial'] ?? null,
        'department_id' => $data['department_id'],
    ]);

    // Update user account fields – map is_active to status
    $userData = [];
    if (isset($data['username'])) {
        $userData['username'] = $data['username'];
    }
    if (isset($data['is_active'])) {
        $userData['status'] = $data['is_active'] ? 'active' : 'inactive';
    }
    if (!empty($userData)) {
        $employee->user->update($userData);
    }

    // Handle photo upload
    if ($request->hasFile('profile_photo')) {
        $path = $request->file('profile_photo')->store('profile_photos', 'public');
        $employee->profile_photo = $path;
        $employee->save();
    }

    return redirect()->route('hr.employees.show', $employee)
        ->with('success', 'Employee updated successfully.');
}

}
