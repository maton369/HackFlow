<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamMembersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = Team::firstWhere('team_name', 'HackFlow Team');
        $leader = User::firstWhere('email', 'leader@example.com');
        $member = User::firstWhere('email', 'member@example.com');

        if ($team && $leader) {
            TeamMember::firstOrCreate(
                ['team_id' => $team->id, 'user_id' => $leader->id],
                ['role' => 'Leader']
            );
        }

        if ($team && $member) {
            TeamMember::firstOrCreate(
                ['team_id' => $team->id, 'user_id' => $member->id],
                ['role' => 'Member']
            );
        }
    }
}
