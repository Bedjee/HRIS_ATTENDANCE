<?php

namespace Database\Seeders;

use App\Models\Cluster;
use App\Models\Department;
use Illuminate\Database\Seeder;

class ClusterDepartmentSeeder extends Seeder
{
    public function run()
    {
        $cluster = Cluster::firstOrCreate(
            ['name' => 'General'],
            ['description' => 'Default cluster for unassigned departments', 'status' => 'active']
        );

        Department::firstOrCreate(
            ['name' => 'Unassigned', 'cluster_id' => $cluster->id],
            ['status' => 'active']
        );
    }
}
