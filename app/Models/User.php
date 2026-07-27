<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'password',
        'role',
        'must_change_password',
        'status', // new
         'theme', // new
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'must_change_password' => 'boolean',
        ];
    }

    // Relationship: a user can have one employee profile
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    // Helper: check if user is HR
    public function isHr()
    {
        return $this->role === 'hr';
    }

    // Helper: check if user is employee
    public function isEmployee()
    {
        return $this->role === 'employee';
    }

    public function isActive()
{
    return $this->status === 'active';
}


}
