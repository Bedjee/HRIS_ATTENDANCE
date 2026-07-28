<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

   protected $fillable = [
    'user_id',
    'first_name',
    'last_name',
    'middle_initial',
    'department_id', // replace 'department'
    'qr_token',
];

    protected $appends = ['full_name', 'formatted_name', 'profile_photo_url'];

    // Relationship: an employee belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
{
    return $this->belongsTo(Department::class);
}



    // Relationship: an employee has many attendance records
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    // Relationship: an employee attends many events (through attendance)
    public function events()
    {
        return $this->belongsToMany(Event::class, 'attendance', 'employee_id', 'event_id')
                    ->withPivot('time_in')
                    ->withTimestamps();
    }

    // Accessor for full name
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Accessor for formatted name with middle initial
    public function getFormattedNameAttribute()
    {
        $middle = $this->middle_initial ? ' ' . $this->middle_initial . '.' : '';
        return $this->first_name . $middle . ' ' . $this->last_name;
    }

    public function requiredEvents()
{
    return $this->belongsToMany(Event::class, 'event_employee');
}


public function getProfilePhotoUrlAttribute()
{
    if (!$this->profile_photo) {
        return null;
    }
    return route('profile.photo.show', [
        'employeeId' => $this->id,
        'filename' => basename($this->profile_photo),
    ]);
}

}
