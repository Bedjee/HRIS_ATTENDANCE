<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            // Change column to nullable and remove default
            $table->integer('grace_period')->nullable()->default(null)->change();
        });
    }

    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->integer('grace_period')->default(0)->change();
        });
    }
};
