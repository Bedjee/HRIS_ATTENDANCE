<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    public function getAll($perPage = 10, $filters = [])
    {
        $query = Department::with(['cluster', 'employees'])
            ->withCount('employees');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        if (!empty($filters['cluster_id'])) {
            $query->where('cluster_id', $filters['cluster_id']);
        }

        return $query->paginate($perPage);
    }

    public function getById($id)
    {
        return Department::with('cluster')->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Department::create($data);
        });
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $department = Department::findOrFail($id);
            $department->update($data);
            return $department;
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $department = Department::withCount('employees')->findOrFail($id);
            if ($department->employees_count > 0) {
                throw new \Exception('Cannot delete department with assigned employees.');
            }
            $department->delete();
        });
    }

    public function getForDropdown()
    {
        return Department::with('cluster')->get(['id', 'name', 'cluster_id']);
    }
}
