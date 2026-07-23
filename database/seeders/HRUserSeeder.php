<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class HRUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if HR user already exists to avoid duplicates
        $existing = User::where('username', 'hradmin')->first();
        if (!$existing) {
            User::create([
                'username' => 'hradmin',
                'password' => Hash::make('password'),
                'role' => 'hr',
                'must_change_password' => false, // HR admin doesn't need to change default
            ]);
        }
    }
}
