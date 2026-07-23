<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Services\DepartmentService;
use App\Models\Cluster;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    protected $departmentService;

    public function __construct(DepartmentService $departmentService)
    {
        $this->departmentService = $departmentService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'cluster_id']);
        $departments = $this->departmentService->getAll($request->input('per_page', 10), $filters);
        $clusters = Cluster::select('id', 'name')->get();

        return Inertia::render('HR/Departments/Index', [
            'departments' => $departments,
            'clusters' => $clusters,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $clusters = Cluster::select('id', 'name')->get();
        return Inertia::render('HR/Departments/Create', ['clusters' => $clusters]);
    }

    public function store(StoreDepartmentRequest $request)
    {
        $this->departmentService->create($request->validated());
        return redirect()->route('hr.departments.index')->with('success', 'Department created.');
    }

    public function edit($id)
    {
        $department = $this->departmentService->getById($id);
        $clusters = Cluster::select('id', 'name')->get();
        return Inertia::render('HR/Departments/Edit', [
            'department' => $department,
            'clusters' => $clusters,
        ]);
    }

    public function update(StoreDepartmentRequest $request, $id)
    {
        $this->departmentService->update($id, $request->validated());
        return redirect()->route('hr.departments.index')->with('success', 'Department updated.');
    }

    public function destroy($id)
    {
        try {
            $this->departmentService->delete($id);
            return back()->with('success', 'Department deleted.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
