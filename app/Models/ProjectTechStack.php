<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTechStack extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'tech_stack_id'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function techStack()
    {
        return $this->belongsTo(TechStack::class);
    }
}
