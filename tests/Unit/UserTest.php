<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Project;
use App\Models\Like;
use App\Models\TechStack;
use App\Models\UserTechStack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_belongs_to_many_teams()
    {
        $user = User::factory()->create();
        $team1 = Team::factory()->create();
        $team2 = Team::factory()->create();

        TeamMember::create([
            'user_id' => $user->id,
            'team_id' => $team1->id,
            'role' => 'owner'
        ]);

        TeamMember::create([
            'user_id' => $user->id,
            'team_id' => $team2->id,
            'role' => 'member'
        ]);

        $this->assertEquals(2, $user->teams()->count());
        $this->assertTrue($user->teams->contains($team1));
        $this->assertTrue($user->teams->contains($team2));
    }

    public function test_user_has_many_tech_stacks()
    {
        $user = User::factory()->create();
        $techStack = TechStack::factory()->create(['name' => 'Laravel']);

        UserTechStack::create([
            'user_id' => $user->id,
            'tech_stack_id' => $techStack->id
        ]);

        $this->assertEquals(1, $user->techStacks()->count());
        $this->assertTrue($user->techStacks->contains($techStack));
    }

    public function test_user_has_many_liked_projects()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        Like::create([
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $this->assertEquals(1, $user->likedProjects()->count());
        $this->assertTrue($user->likedProjects->contains($project));
    }

    public function test_user_has_many_projects_through_teams()
    {
        $user = User::factory()->create();
        $team = Team::factory()->create();
        $project = Project::factory()->create(['team_id' => $team->id]);

        TeamMember::create([
            'user_id' => $user->id,
            'team_id' => $team->id,
            'role' => 'owner'
        ]);

        $this->assertEquals(1, $user->projects()->count());
        $this->assertTrue($user->projects->contains($project));
    }

    public function test_user_has_fillable_attributes()
    {
        $fillable = [
            'name',
            'email',
            'password',
            'google_id',
            'github_id',
            'profile_image',
            'bio'
        ];

        $user = new User();

        $this->assertEquals($fillable, $user->getFillable());
    }

    public function test_user_password_is_hidden()
    {
        $user = User::factory()->create();

        $this->assertArrayNotHasKey('password', $user->toArray());
    }

    public function test_user_email_is_verified_timestamp_is_cast_to_datetime()
    {
        $user = User::factory()->create([
            'email_verified_at' => now()
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);
    }

    public function test_user_can_check_if_liked_project()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $this->assertFalse($user->hasLikedProject($project->id));

        Like::create([
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $this->assertTrue($user->hasLikedProject($project->id));
    }
}