<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Department;
use App\Models\Employee;

return new class extends Migration
{
    public function up()
    {
        // First, create a default department if none exists (for existing employees)
        // We'll create a seeder for that, but we need a foreign key column.
        // So we'll add the column without foreign key first, assign a default, then add foreign key.

        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->after('user_id');
        });

        // Now assign a default department (e.g., create one if not exists)
        $defaultCluster = \App\Models\Cluster::firstOrCreate(
            ['name' => 'General'],
            ['description' => 'Default cluster', 'status' => 'active']
        );
        $defaultDepartment = Department::firstOrCreate(
            ['name' => 'Unassigned', 'cluster_id' => $defaultCluster->id],
            ['status' => 'active']
        );

        // Assign all employees to this department if they don't have one
        Employee::whereNull('department_id')->update(['department_id' => $defaultDepartment->id]);

        // Now make the column not nullable and add foreign key
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable(false)->change();
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
        });

        // Drop the old department column (if exists)
        if (Schema::hasColumn('employees', 'department')) {
            Schema::table('employees', function (Blueprint $table) {
                $table->dropColumn('department');
            });
        }
    }

    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
            $table->string('department')->nullable();
        });
    }
};
