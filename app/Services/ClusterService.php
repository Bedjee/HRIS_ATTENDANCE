<?php

namespace App\Services;

use App\Models\Cluster;
use Illuminate\Support\Facades\DB;

class ClusterService
{
    public function getAll($perPage = 10)
    {
        return Cluster::withCount(['departments', 'employees'])->paginate($perPage);
    }

    public function getById($id)
    {
        return Cluster::withCount(['departments', 'employees'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Cluster::create($data);
        });
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $cluster = Cluster::findOrFail($id);
            $cluster->update($data);
            return $cluster;
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $cluster = Cluster::withCount('departments')->findOrFail($id);
            if ($cluster->departments_count > 0) {
                throw new \Exception('Cannot delete cluster with existing departments.');
            }
            $cluster->delete();
        });
    }
}
