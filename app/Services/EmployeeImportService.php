<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\User;
use App\Models\Department; // Added
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
        $rows = Excel::toArray([], $file)[0] ?? [];
        $headers = array_shift($rows);

        $valid = [];
        $duplicates = [];
        $invalid = [];

        $expectedHeaders = ['Last Name', 'First Name', 'Middle Initial', 'Department'];
        $headerMap = [];
        foreach ($expectedHeaders as $expected) {
            $found = false;
            foreach ($headers as $index => $header) {
                if (strtolower(trim($header)) === strtolower($expected)) {
                    $headerMap[$expected] = $index;
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                throw new \Exception("Missing header: $expected");
            }
        }

        // Pre‑fetch all department names for quick lookup
        $departmentMap = Department::pluck('id', 'name')->toArray();

        // Track duplicates within this import (by first_name + last_name + department_id)
        $seen = [];

        foreach ($rows as $rowIndex => $row) {
            $lastName = trim($row[$headerMap['Last Name']] ?? '');
            $firstName = trim($row[$headerMap['First Name']] ?? '');
            $middleInitial = trim($row[$headerMap['Middle Initial']] ?? '');
            $departmentName = trim($row[$headerMap['Department']] ?? '');

            $errors = [];
            $departmentId = null;

            if (empty($lastName)) $errors[] = 'Last Name is required';
            if (empty($firstName)) $errors[] = 'First Name is required';
            if (empty($departmentName)) $errors[] = 'Department is required';

            // Validate department exists
            if (empty($errors) && !empty($departmentName)) {
                $departmentId = $departmentMap[$departmentName] ?? null;
                if (!$departmentId) {
                    $errors[] = "Department '$departmentName' does not exist. Please create it first.";
                }
            }

            // Duplicate check (only if no validation errors)
            $isDuplicateInDb = false;
            $isDuplicateInImport = false;
            if (empty($errors) && $departmentId) {
                // Check database for existing employee with same name and department
                $exists = Employee::where('first_name', $firstName)
                    ->where('last_name', $lastName)
                    ->where('department_id', $departmentId)
                    ->exists();
                if ($exists) {
                    $isDuplicateInDb = true;
                }

                // Check within the current import
                $duplicateKey = $firstName . '|' . $lastName . '|' . $departmentId;
                if (isset($seen[$duplicateKey])) {
                    $isDuplicateInImport = true;
                } else {
                    $seen[$duplicateKey] = true;
                }
            }

            $record = [
                'row' => $rowIndex + 2,
                'last_name' => $lastName,
                'first_name' => $firstName,
                'middle_initial' => $middleInitial,
                'department_name' => $departmentName, // keep for display
                'department_id' => $departmentId,     // will be used for import
                'errors' => $errors,
            ];

            if (!empty($errors)) {
                $invalid[] = $record;
            } elseif ($isDuplicateInDb || $isDuplicateInImport) {
                $record['duplicate_type'] = $isDuplicateInDb ? 'database' : 'import';
                $duplicates[] = $record;
            } else {
                $valid[] = $record;
            }
        }

        return [
            'valid' => $valid,
            'duplicates' => $duplicates,
            'invalid' => $invalid,
        ];
    }

    /**
     * Import the validated records.
     */
   /**
     * Import the validated records.
     */
    public function import(array $validRecords): array
    {
        $created = [];
        $failed = [];

        DB::transaction(function () use ($validRecords, &$created, &$failed) {
            foreach ($validRecords as $record) {
                try {
                    $username = $this->generateUniqueUsername($record['first_name'], $record['last_name']);

                    $user = User::create([
                        'username' => $username,
                        'password' => Hash::make('password'),
                        'role' => 'employee',
                        'must_change_password' => true,
                    ]);

                    // ✅ Use the new token generation method
                    $qrToken = $this->generateUniqueQrToken();

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

        return [
            'created' => $created,
            'failed' => $failed,
        ];
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
