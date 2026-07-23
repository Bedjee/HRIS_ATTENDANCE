<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->text('description')->nullable()->after('title');
            $table->time('end_time')->nullable()->after('time');
            $table->enum('status', ['upcoming', 'ongoing', 'completed'])->default('upcoming')->after('venue');
        });
    }

    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['description', 'end_time', 'status']);
        });
    }
};
