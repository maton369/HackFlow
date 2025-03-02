<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['team_name', 'team_image_url'];

    public function members()
    {
        return $this->belongsToMany(User::class, 'team_members');
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
