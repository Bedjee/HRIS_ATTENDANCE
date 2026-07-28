<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance'; // <-- add this line

    protected $fillable = [
    'employee_id',
    'event_id',
    'time_in',
     'status', // new
    'is_manual',
    'recorded_by',
    'remarks',


];

protected $casts = [
    'status' => 'string',
];



    // Each attendance belongs to an employee
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    // Each attendance belongs to an event
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function recorder()
{
    return $this->belongsTo(User::class, 'recorded_by');
}
}
