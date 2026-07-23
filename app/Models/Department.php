<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['cluster_id', 'name', 'status'];

    protected $casts = [
        'status' => 'string',
    ];

    public function cluster()
    {
        return $this->belongsTo(Cluster::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
