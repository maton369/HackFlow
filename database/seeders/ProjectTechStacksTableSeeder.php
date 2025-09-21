<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectTechStack;
use App\Models\TechStack;
use Illuminate\Database\Seeder;

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
