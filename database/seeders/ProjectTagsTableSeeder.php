<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Tag;
use App\Models\ProjectTag;

class ProjectTagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $project = Project::firstWhere('project_name', 'HackFlow App');
        $tags = Tag::whereIn('name', ['Hackathon', 'Web App'])->get();

        if ($project) {
            foreach ($tags as $tag) {
                ProjectTag::firstOrCreate(
                    ['project_id' => $project->id, 'tag_id' => $tag->id]
                );
            }
        }
    }
}
