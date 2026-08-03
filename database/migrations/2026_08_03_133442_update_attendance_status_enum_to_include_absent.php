<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // MySQL ENUM modification requires a raw SQL statement
        DB::statement("ALTER TABLE attendance MODIFY COLUMN status ENUM('present', 'late', 'absent') NOT NULL DEFAULT 'present'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE attendance MODIFY COLUMN status ENUM('present', 'late') NOT NULL DEFAULT 'present'");
    }
};
