<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeImportService
{
    /**
     * Generate a unique QR token with collision avoidance.
     */
    public function generateUniqueQrToken(): string
    {
        $maxAttempts = 10;
        for ($i = 0; $i < $maxAttempts; $i++) {
            $token = Str::random(32);
            if (!Employee::where('qr_token', $token)->exists()) {
                return $token;
            }
        }
        // Extremely unlikely fallback – append timestamp and random number
        return Str::random(32) . now()->timestamp . rand(1000, 9999);
    }

    /**
     * Generate a unique username based on first name and last name.
     */
    public function generateUniqueUsername(string $firstName, string $lastName): string
    {
        $base = strtolower($firstName . $lastName);
        $maxAttempts = 50;
        $attempts = 0;

        do {
            $random = rand(1000, 9999);
            $username = $base . $random;
            $exists = User::where('username', $username)->exists();
            $attempts++;
        } while ($exists && $attempts < $maxAttempts);

        if ($exists) {
            $username = $base . time();
        }

        return $username;
    }

    /**
     * Validate and parse the Excel file, returning an array of valid, duplicate, invalid records.
     */
    public function previewImport($file): array
    {
        // ... (unchanged) ...
    }

    /**
     * Import the validated records in chunks with optimized collision detection.
     */
    public function import(array $validRecords): array
    {
        $created = [];
        $failed = [];

        // Pre-fetch existing usernames and QR tokens to avoid DB queries per record
        $existingUsernames = User::pluck('username')->toArray();
        $existingQrTokens = Employee::pluck('qr_token')->toArray();

        $chunkSize = 50;
        $chunks = array_chunk($validRecords, $chunkSize);

        foreach ($chunks as $chunk) {
            DB::transaction(function () use ($chunk, &$created, &$failed, &$existingUsernames, &$existingQrTokens) {
                foreach ($chunk as $record) {
                    try {
                        $username = $this->generateUniqueUsernameInMemory(
                            $record['first_name'],
                            $record['last_name'],
                            $existingUsernames
                        );
                        $existingUsernames[] = $username;

                        $user = User::create([
                            'username' => $username,
                            'password' => Hash::make('password'),
                            'role' => 'employee',
                            'must_change_password' => true,
                        ]);

                        $qrToken = $this->generateUniqueQrTokenInMemory($existingQrTokens);
                        $existingQrTokens[] = $qrToken;

                        $employee = Employee::create([
                            'user_id' => $user->id,
                            'first_name' => $record['first_name'],
                            'last_name' => $record['last_name'],
                            'middle_initial' => $record['middle_initial'] ?: null,
                            'department_id' => $record['department_id'],
                            'qr_token' => $qrToken,
                        ]);

                        $created[] = [
                            'username' => $username,
                            'full_name' => $employee->full_name,
                            'department' => $record['department_name'],
                        ];
                    } catch (\Exception $e) {
                        $failed[] = [
                            'record' => $record,
                            'error' => $e->getMessage(),
                        ];
                    }
                }
            });
        }

        return [
            'created' => $created,
            'failed' => $failed,
        ];
    }

    /**
     * Generate unique username using in-memory set (no DB queries).
     */
    private function generateUniqueUsernameInMemory(string $firstName, string $lastName, array &$existingUsernames): string
    {
        $base = strtolower($firstName . $lastName);
        $maxAttempts = 50;
        $attempts = 0;
        do {
            $random = rand(1000, 9999);
            $username = $base . $random;
            $attempts++;
        } while (in_array($username, $existingUsernames) && $attempts < $maxAttempts);

        // Fallback if still not unique
        if (in_array($username, $existingUsernames)) {
            $username = $base . time();
            if (in_array($username, $existingUsernames)) {
                $username = $base . uniqid();
            }
        }
        return $username;
    }

    /**
     * Generate unique QR token using in-memory set (no DB queries).
     */
    private function generateUniqueQrTokenInMemory(array &$existingQrTokens): string
    {
        $maxAttempts = 10;
        for ($i = 0; $i < $maxAttempts; $i++) {
            $token = Str::random(32);
            if (!in_array($token, $existingQrTokens)) {
                return $token;
            }
        }
        // Fallback – extremely unlikely
        return Str::random(32) . now()->timestamp . rand(1000, 9999);
    }

    public function createEmployeeFromData(array $data): Employee
    {
        $username = $this->generateUniqueUsername($data['first_name'], $data['last_name']);
        $qrToken = $this->generateUniqueQrToken();

        $user = User::create([
            'username' => $username,
            'password' => Hash::make('password'),
            'role' => 'employee',
            'must_change_password' => true,
        ]);

        return Employee::create([
            'user_id' => $user->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'middle_initial' => $data['middle_initial'] ?? null,
            'department_id' => $data['department_id'],
            'qr_token' => $qrToken,
        ]);
    }
}
