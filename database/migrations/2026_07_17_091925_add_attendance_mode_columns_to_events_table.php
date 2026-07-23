<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->enum('attendance_mode', [
                'all_employees',
                'selected_clusters',
                'selected_departments',
                'selected_employees'
            ])->default('all_employees')->after('status');
            $table->json('selected_clusters')->nullable()->after('attendance_mode');
            $table->json('selected_departments')->nullable()->after('selected_clusters');
        });
    }

    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['attendance_mode', 'selected_clusters', 'selected_departments']);
        });
    }
};
