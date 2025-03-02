<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TechStack;
use App\Models\TechStackStatistic;

class TechStackStatisticsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $totalProjects = 1;
        $techStacks = TechStack::whereIn('name', ['Laravel', 'Vue.js'])->get();

        foreach ($techStacks as $techStack) {
            TechStackStatistic::firstOrCreate(
                ['tech_stack_id' => $techStack->id],
                [
                    'total_projects' => $totalProjects,
                    'usage_count' => 1,
                    'usage_ratio' => 100
                ]
            );
        }
    }
}
