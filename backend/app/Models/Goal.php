<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable =[ 'title', 'description', 'is_achieved' ,'user_id' ];

    protected $casts = [
        'is_achieved' => 'boolean',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
