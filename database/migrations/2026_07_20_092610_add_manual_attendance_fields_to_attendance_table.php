<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->boolean('is_manual')->default(false)->after('time_in');
            $table->foreignId('recorded_by')->nullable()->after('is_manual')->constrained('users')->nullOnDelete();
            $table->text('remarks')->nullable()->after('recorded_by');
        });
    }

    public function down()
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropForeign(['recorded_by']);
            $table->dropColumn(['is_manual', 'recorded_by', 'remarks']);
        });
    }
};
