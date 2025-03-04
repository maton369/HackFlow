<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'user_id',
        'role',
    ];

    // 🔥 チームメンバーが所属するチーム
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    // 🔥 チームメンバーのユーザー情報
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleted(function ($teamMember) {
            $team = $teamMember->team;

            if ($team && $team->members()->count() === 0) {
                $team->delete();
            }
        });
    }
}
