<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_name',
        'app_name',
        'project_image_url',
        'github_url',
        'live_url',
        'team_id',
        'like_count'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class)->with('users');
    }

    public function techStacks()
    {
        return $this->belongsToMany(TechStack::class, 'project_tech_stacks');
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'project_tags');
    }

    public function steps()
    {
        return $this->hasMany(ProjectStep::class, 'project_id');
    }

    public function projectSteps()
    {
        return $this->hasMany(ProjectStep::class);
    }

    public function likeCount()
    {
        return $this->likes()->count();
    }
}
