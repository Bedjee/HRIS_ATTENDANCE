<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'date', 'time', 'end_time',
        'venue', 'status', 'attendance_mode',
        'selected_clusters', 'selected_departments'
    ];

    protected $casts = [
        'selected_clusters' => 'array',
        'selected_departments' => 'array',
    ];

    public function requiredEmployees()
    {
        return $this->belongsToMany(Employee::class, 'event_employee');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
