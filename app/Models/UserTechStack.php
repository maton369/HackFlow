<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTechStack extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'tech_stack_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function techStack()
    {
        return $this->belongsTo(TechStack::class);
    }
}
