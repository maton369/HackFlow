<?php

namespace Database\Seeders;

use App\Models\Like;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

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
