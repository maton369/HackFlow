<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Tag;

class ProjectTagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $project = Project::firstWhere('project_name', 'HackFlow App');
        $tagNames = ['Hackathon', 'Web App'];

        if ($project) {
            $tagIds = [];

            foreach ($tagNames as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }

            $project->tags()->syncWithoutDetaching($tagIds);
        }
    }
}
