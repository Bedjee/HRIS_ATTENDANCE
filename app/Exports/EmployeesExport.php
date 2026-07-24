<?php

namespace App\Exports;

use App\Models\Employee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class EmployeesExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Employee::with(['user', 'department'])->get()->map(function ($employee) {
            return [
                'department' => $employee->department->name ?? 'Unassigned',
                'username' => $employee->user->username,
                'default_password' => 'password',
            ];
        });
    }

    public function headings(): array
    {
        return ['Department', 'Username', 'Default Password'];
    }
}
