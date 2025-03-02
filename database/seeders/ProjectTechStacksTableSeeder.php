<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\TechStack;
use App\Models\ProjectTechStack;

class ProjectTechStacksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $project = Project::firstWhere('project_name', 'HackFlow App');
        $techStacks = TechStack::whereIn('name', ['Laravel', 'Vue.js'])->get();

        if ($project) {
            foreach ($techStacks as $techStack) {
                ProjectTechStack::firstOrCreate(
                    ['project_id' => $project->id, 'tech_stack_id' => $techStack->id]
                );
            }
        }
    }
}
