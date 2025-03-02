<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UsersTableSeeder::class,
            TechStacksTableSeeder::class,
            TeamsTableSeeder::class,
            TeamMembersTableSeeder::class,
            ProjectsTableSeeder::class,
            TagsTableSeeder::class,
            ProjectTagsTableSeeder::class,
            ProjectTechStacksTableSeeder::class,
            LikesTableSeeder::class,
            TechStackStatisticsTableSeeder::class,
            ProjectStepsTableSeeder::class,
        ]);
    }
}
