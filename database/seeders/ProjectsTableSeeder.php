<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Team;

class ProjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = Team::firstWhere('team_name', 'HackFlow Team');

        if ($team) {
            Project::firstOrCreate(
                ['project_name' => 'HackFlow App'],
                [
                    'app_name' => 'HackFlow',
                    'project_image_url' => 'https://example.com/project.jpg',
                    'github_url' => 'https://github.com/hackflow',
                    'live_url' => 'https://hackflow.example.com',
                    'team_id' => $team->id,
                    'like_count' => 0
                ]
            );
        }
    }
}
