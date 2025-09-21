<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'github_id',
        'profile_image',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function techStacks()
    {
        return $this->belongsToMany(TechStack::class, 'user_tech_stacks', 'user_id', 'tech_stack_id')
            ->withTimestamps(); // 🔥 タイムスタンプを含める
    }

    public function urls()
    {
        return $this->hasMany(UserUrl::class);
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_members', 'user_id', 'team_id')
            ->select('teams.id', 'teams.team_name');
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(TeamMember::class, 'user_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'team_members', 'user_id', 'team_id', 'id', 'team_id')
            ->with('team');
    }

    public function likedProjects()
    {
        return $this->belongsToMany(Project::class, 'likes', 'user_id', 'project_id')
            ->with('team') // ✅ プロジェクトの所属チーム情報を取得
            ->withTimestamps(); // 🔥 タイムスタンプを含める
    }

    public function hasLikedProject($projectId)
    {
        return $this->likedProjects()->where('project_id', $projectId)->exists();
    }
}
