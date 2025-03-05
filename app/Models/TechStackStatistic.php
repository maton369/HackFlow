<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        // ✅ 技術スタックが登録されているプロジェクトの総数を取得
        $totalProjects = DB::table('project_tech_stacks')
            ->distinct('project_id')
            ->count('project_id');

        if ($totalProjects === 0) {
            // プロジェクトが 0 件なら統計をクリア
            self::truncate();
            return;
        }

        // ✅ 各技術スタックの使用数を取得
        $techStacks = DB::table('project_tech_stacks')
            ->select('tech_stack_id', DB::raw('COUNT(DISTINCT project_id) as count'))
            ->groupBy('tech_stack_id')
            ->get();

        // 🔥 統計データをクリアし、正しく再計算する
        self::truncate();

        foreach ($techStacks as $techStack) {
            $usageRatio = ($totalProjects > 0) ? ($techStack->count / $totalProjects) * 100 : 0;

            // ✅ 使用プロジェクトが 0 件ならデータを保存しない
            if ($techStack->count > 0) {
                self::updateOrCreate(
                    ['tech_stack_id' => $techStack->tech_stack_id],
                    [
                        'total_projects' => $totalProjects, // ✅ 技術スタックが関与しているプロジェクト数
                        'usage_count' => $techStack->count, // ✅ この技術スタックが使われているプロジェクト数
                        'usage_ratio' => round($usageRatio, 2), // ✅ 正確な割合を計算
                    ]
                );
            }
        }
    }
}
