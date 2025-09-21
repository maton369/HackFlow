<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Team::firstOrCreate([
            'team_name' => 'HackFlow Team',
            'team_image_url' => 'https://example.com/team.jpg',
        ]);
    }
}
