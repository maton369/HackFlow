<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProjectStep;
use App\Models\Project;

class ProjectStepsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $project = Project::first();

        if ($project) {
            ProjectStep::firstOrCreate(
                ['project_id' => $project->id, 'title' => '要件定義'],
                ['description' => 'このプロジェクトの要件を定義する工程です。']
            );

            ProjectStep::firstOrCreate(
                ['project_id' => $project->id, 'title' => '設計'],
                ['description' => 'システム設計とデータベース設計を行う工程です。']
            );

            ProjectStep::firstOrCreate(
                ['project_id' => $project->id, 'title' => '実装'],
                ['description' => 'プログラムの実装を行う工程です。']
            );
        }
    }
}
