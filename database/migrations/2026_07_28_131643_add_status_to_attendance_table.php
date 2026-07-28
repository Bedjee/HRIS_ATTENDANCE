<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->enum('status', ['present', 'late'])->default('present')->after('time_in');
        });
    }

    public function down()
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
