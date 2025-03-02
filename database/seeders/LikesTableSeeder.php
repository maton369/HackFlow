<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use App\Models\Like;

class LikesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstWhere('email', 'member@example.com');
        $project = Project::firstWhere('project_name', 'HackFlow App');

        if ($user && $project) {
            Like::firstOrCreate(
                ['user_id' => $user->id, 'project_id' => $project->id],
                ['is_active' => true]
            );
        }
    }
}
