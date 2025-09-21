<?php

namespace Tests\Unit;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamTest extends TestCase
{
    use RefreshDatabase;

    public function test_team_has_many_members()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        TeamMember::create([
            'user_id' => $user->id,
            'team_id' => $team->id,
            'role' => 'member'
        ]);

        $this->assertEquals(1, $team->members()->count());
        $this->assertTrue($team->members->contains('user_id', $user->id));
    }

    public function test_team_has_owner()
    {
        $team = Team::factory()->create();
        $owner = User::factory()->create();

        TeamMember::create([
            'user_id' => $owner->id,
            'team_id' => $team->id,
            'role' => 'owner'
        ]);

        $this->assertNotNull($team->owner);
        $this->assertEquals($owner->id, $team->owner->user_id);
    }

    public function test_team_has_many_projects()
    {
        $team = Team::factory()->create();
        $project = Project::factory()->create(['team_id' => $team->id]);

        $this->assertEquals(1, $team->projects()->count());
        $this->assertTrue($team->projects->contains($project));
    }

    public function test_team_belongs_to_many_users()
    {
        $team = Team::factory()->create();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        TeamMember::create([
            'user_id' => $user1->id,
            'team_id' => $team->id,
            'role' => 'owner'
        ]);

        TeamMember::create([
            'user_id' => $user2->id,
            'team_id' => $team->id,
            'role' => 'member'
        ]);

        $this->assertEquals(2, $team->users()->count());
        $this->assertTrue($team->users->contains($user1));
        $this->assertTrue($team->users->contains($user2));
    }

    public function test_team_has_fillable_attributes()
    {
        $fillable = [
            'team_name',
            'team_image_url',
        ];

        $team = new Team();

        $this->assertEquals($fillable, $team->getFillable());
    }

    public function test_team_can_be_created_with_team_name()
    {
        $teamData = [
            'team_name' => 'Test Team',
            'team_image_url' => 'https://example.com/image.jpg'
        ];

        $team = Team::create($teamData);

        $this->assertDatabaseHas('teams', $teamData);
        $this->assertEquals('Test Team', $team->team_name);
    }
}