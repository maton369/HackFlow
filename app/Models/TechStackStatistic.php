<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TechStackStatistic extends Model
{
    use HasFactory;

    protected $fillable = ['total_projects', 'tech_stack_id', 'usage_count', 'usage_ratio'];

    public function techStack()
    {
        return $this->belongsTo(TechStack::class);
    }
}
