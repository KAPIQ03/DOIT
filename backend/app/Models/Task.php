<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'is_completed', 'date_creation', 'project_id'];
    protected $casts = [
        'is_completed' => 'boolean',
        'date_creation' => 'date',
    ];
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
