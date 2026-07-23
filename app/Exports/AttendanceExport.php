<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AttendanceExport implements FromArray, WithHeadings
{
    protected $attendances;

    public function __construct(array $attendances)
    {
        $this->attendances = $attendances;
    }

    public function array(): array
    {
        return $this->attendances;
    }

    public function headings(): array
    {
        return [
            'Employee Name',
            'Department',
            'Cluster',
            'Time In',
        ];
    }
}
