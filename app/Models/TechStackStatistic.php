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

    /**
     * 🔥 技術スタックの統計を更新するメソッド
     */
    public static function updateStatistics()
    {
        $totalProjects = Project::count(); // 全プロジェクト数を取得

        $techStacks = \DB::table('project_tech_stacks')
            ->select('tech_stack_id', \DB::raw('COUNT(DISTINCT project_id) as count'))
            ->groupBy('tech_stack_id')
            ->get();

        foreach ($techStacks as $techStack) {
            $usageRatio = ($totalProjects > 0) ? ($techStack->count / $totalProjects) * 100 : 0;

            self::updateOrCreate(
                ['tech_stack_id' => $techStack->tech_stack_id],
                [
                    'total_projects' => $totalProjects,
                    'usage_count' => $techStack->count,
                    'usage_ratio' => round($usageRatio, 2),
                ]
            );
        }
    }
}
